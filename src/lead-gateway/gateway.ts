/**
 * The Zero Phuket lead gateway.
 *
 * Per lead: known form -> honeypot -> required fields -> reCAPTCHA Enterprise
 * (when its secrets are set) -> duplicate window -> Kommo (Kwid webhook)
 * -> audit log in KV.
 *
 * Rejected spam is answered as a success so bots stop probing. A Google-side
 * reCAPTCHA outage lets the lead through without a score. A lead is never lost
 * to the log or the duplicate window: only a failed Kommo call is an error.
 *
 * Secrets (Cloudflare > Workers > thezero-emdash > Settings > Variables and Secrets):
 *   RECAPTCHA_API_KEY, RECAPTCHA_PROJECT - without them the reCAPTCHA token is
 *   passed on to Kommo unchecked, which is what the forms did on WordPress.
 * KV binding LEADS: audit log (180 days) and the duplicate window.
 */
import {
	DEDUPE_WINDOW_SEC,
	FORMS,
	KOMMO,
	LANGUAGES,
	LOG_TTL_SEC,
	PROJECT_ANSWERS,
	PROJECTS,
	RECAPTCHA,
	RECAPTCHA_THRESHOLD,
	SEARCH_ENGINES,
	SOCIAL_SITES,
	type ProjectKey,
} from "./config";

export interface GatewayEnv {
	LEADS?: KVNamespace;
	RECAPTCHA_API_KEY?: string;
	RECAPTCHA_PROJECT?: string;
}

type Body = Record<string, string>;
export interface GatewayResult {
	status: number;
	body: { success: boolean; ok: boolean; lead_ref?: string; error?: string; data?: { message: string } };
}

const reply = (status: number, ok: boolean, extra: Partial<GatewayResult["body"]> = {}): GatewayResult => ({
	status,
	body: { success: ok, ok, ...extra },
});

export function makeRef(): string {
	const t = Date.now().toString(36).toUpperCase().slice(-6);
	const r = Math.random().toString(36).toUpperCase().slice(2, 5);
	return `ZER${t}${r}`;
}

const normalisePhone = (p: string) => String(p).replace(/[\s\-().]/g, "").replace(/^0+/, "");

/** "+66 812345678" from the form's country code and number; a number already starting with + is kept. */
function fullPhone(body: Body): string {
	const raw = (body.phone || "").trim();
	if (!raw) return "";
	if (raw.startsWith("+")) return raw;
	const cc = (body.countryCode || "").trim();
	return cc ? `${cc} ${normalisePhone(raw)}` : raw;
}

async function assessRecaptcha(env: GatewayEnv, token: string) {
	if (!token) return { ok: false, reason: "no_token" } as const;
	const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${env.RECAPTCHA_PROJECT}/assessments?key=${env.RECAPTCHA_API_KEY}`;
	let res: Response;
	try {
		res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ event: { token, siteKey: RECAPTCHA.siteKey, expectedAction: RECAPTCHA.action } }),
		});
	} catch (e) {
		return { ok: false, reason: "api_network", detail: String(e).slice(0, 120) } as const;
	}
	if (!res.ok) return { ok: false, reason: `api_${res.status}`, detail: (await res.text()).slice(0, 200) } as const;
	let data: any;
	try {
		data = await res.json();
	} catch {
		return { ok: false, reason: "api_badjson" } as const;
	}
	const props = data.tokenProperties || {};
	const score: number = data.riskAnalysis?.score ?? 0;
	if (!props.valid) return { ok: false, reason: `invalid_${props.invalidReason || ""}`, score } as const;
	if (props.action && props.action !== RECAPTCHA.action) return { ok: false, reason: "action_mismatch", score } as const;
	if (score < RECAPTCHA_THRESHOLD) return { ok: false, reason: "low_score", score } as const;
	return { ok: true, score } as const;
}

const dedupeKey = (body: Body) => {
	const id = (body.email || "").trim().toLowerCase() || normalisePhone(body.phone || "");
	return id ? `dd:${id}` : null;
};
const fingerprint = (body: Body) =>
	JSON.stringify([body.form_id, body.name, body.investGoal || body.goal, body.project, body.is_agent]);

async function writeLog(env: GatewayEnv, ref: string, status: string, body: Body, extra?: unknown) {
	console.log("LEAD", JSON.stringify({ ref, status, form_id: body.form_id, email: body.email, campaign: body.utm_campaign, extra: extra ?? null }));
	if (!env.LEADS) return;
	try {
		const ts = new Date().toISOString();
		await env.LEADS.put(
			`log:${ts}:${ref}`,
			JSON.stringify({ ts, ref, status, channel: channelOf(body).channel, form_id: body.form_id, email: body.email, phone: body.phone, campaign: body.utm_campaign, search_term: body.search_term || body.utm_term || "", landing_page: body.landing_page, page_url: body.page_url, extra: extra ?? null }),
			{ expirationTtl: LOG_TTL_SEC },
		);
	} catch (e) {
		console.error("lead log", String(e));
	}
}

/**
 * How the visitor arrived, from the attribution the form sends.
 * Ad click ids or a paid medium win; then UTMs; then the referrer of the first page of the visit.
 */
export function channelOf(body: Body): { channel: string; source: string } {
	const medium = (body.utm_medium || "").toLowerCase();
	const utmSource = (body.utm_source || "").toLowerCase();
	if (body.gclid || body.gbraid || body.wbraid || /^(cpc|ppc|paid|paidsearch)/.test(medium)) {
		return { channel: "Paid Search", source: utmSource || "google" };
	}
	if (utmSource) {
		if (medium === "organic") return { channel: "SEO", source: utmSource };
		if (/social/.test(medium)) return { channel: "Social", source: utmSource };
		if (/email/.test(medium)) return { channel: "Email", source: utmSource };
		return { channel: "Campaign", source: utmSource };
	}
	let host = "";
	try {
		host = body.referrer ? new URL(body.referrer).hostname.replace(/^www\./, "").toLowerCase() : "";
	} catch {
		host = "";
	}
	let own = "";
	try {
		own = body.page_url ? new URL(body.page_url).hostname.replace(/^www\./, "").toLowerCase() : "";
	} catch {
		own = "";
	}
	if (!host || host === own) return { channel: "Direct", source: "direct" };
	if (SEARCH_ENGINES.some((s) => host.includes(s))) return { channel: "SEO", source: host.split(".").find((p) => !["search", "m", "www"].includes(p)) || host };
	if (SOCIAL_SITES.some((s) => host === s || host.endsWith(`.${s}`) || host.includes(s))) return { channel: "Social", source: host };
	return { channel: "Referral", source: host };
}

/** The Kommo payload - the same shape /invest-sati sends to the Kwid webhook. */
function kommoPayload(body: Body, ref: string, recaptcha: { token: string; score: number | null }) {
	const form = FORMS[body.form_id];
	const projectKey: ProjectKey = form.project ?? PROJECT_ANSWERS[body.project] ?? "both";
	const project = PROJECTS[projectKey];
	const langCode = body.lang_code || body.lang || "en";
	const language = LANGUAGES[langCode] || "English";
	const { channel, source } = channelOf(body);
	// Without a campaign UTM, the campaign field and tag carry the channel ("SEO", "Direct"...).
	const campaign = body.utm_campaign || (channel === "Paid Search" || channel === "Campaign" ? "" : channel);
	const f = KOMMO.fields;
	return {
		name: body.name.trim(),
		email: body.email.trim(),
		phone: fullPhone(body),
		pipeline_id: KOMMO.pipelineId,
		tags: [...new Set([...form.tags, channel, project.tag, language, campaign || "direct"])].join(","),
		recaptcha_token: recaptcha.token,
		custom_fields: {
			[f.property]: project.property,
			[f.unitType]: "",
			[f.goal]: body.investGoal || body.goal || "",
			[f.variant]: body.form_id,
			[f.utmCampaign]: campaign,
			[f.utmSource]: body.utm_source || source,
			is_agent: body.is_agent || "No",
			language,
		},
		metadata: {
			form_id: body.form_id,
			form_name: form.formName,
			lead_ref: ref,
			channel,
			source,
			referrer: body.referrer || "",
			project_preference: projectKey,
			page_url: body.page_url || "",
			landing_page: body.landing_page || "",
			gclid: body.gclid || "",
			gbraid: body.gbraid || "",
			wbraid: body.wbraid || "",
			gad_source: body.gad_source || "",
			utm_source: body.utm_source || "",
			utm_medium: body.utm_medium || "",
			utm_campaign: campaign,
			utm_content: body.utm_content || "",
			utm_term: body.utm_term || "",
			// Ads keyword (utm_term) or, when a search engine passes it, the organic search words
			search_term: body.search_term || body.utm_term || "",
			recaptcha_score: recaptcha.score == null ? "" : String(recaptcha.score),
			ip: body._ip || "",
			submitted_at: new Date().toISOString(),
			language: langCode,
		},
	};
}

export async function handleLead(env: GatewayEnv, body: Body): Promise<GatewayResult> {
	const form = FORMS[body.form_id];
	if (!form) return reply(400, false, { error: "unknown_form", data: { message: "Unknown form." } });

	const ref = makeRef();

	// Spam trap: pretend success
	if (body[form.honeypot]) {
		await writeLog(env, ref, "reject_honeypot", body);
		return reply(200, true, { lead_ref: ref });
	}

	if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
		return reply(422, false, { error: "missing_fields", data: { message: "Please fill in your name, email and phone." } });
	}

	// reCAPTCHA Enterprise, when the secrets are set. A token can be assessed once,
	// so after a server-side check it is not passed on to Kommo.
	let score: number | null = null;
	let tokenForKommo = body.recaptcha_token || "";
	if (env.RECAPTCHA_API_KEY && env.RECAPTCHA_PROJECT) {
		const rc = await assessRecaptcha(env, body.recaptcha_token || "");
		if (!rc.ok && !String(rc.reason).startsWith("api_")) {
			await writeLog(env, ref, "reject_recaptcha", body, rc);
			return reply(200, true, { lead_ref: ref });
		}
		if (rc.ok) {
			score = rc.score;
			tokenForKommo = "";
		} else {
			await writeLog(env, ref, "recaptcha_unavailable", body, rc);
		}
	}

	// Duplicate window: the same person sending the same answers again (double click, retry)
	const dKey = env.LEADS ? dedupeKey(body) : null;
	if (dKey && env.LEADS) {
		try {
			const rec = await env.LEADS.get<{ ref: string; fp: string }>(dKey, "json");
			if (rec && rec.fp === fingerprint(body)) {
				await writeLog(env, ref, "reject_duplicate", body, { first_ref: rec.ref });
				return reply(200, true, { lead_ref: rec.ref });
			}
		} catch (e) {
			console.error("dedupe read", String(e));
		}
	}

	try {
		const res = await fetch(KOMMO.webhook, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(kommoPayload(body, ref, { token: tokenForKommo, score })),
		});
		if (!res.ok) throw new Error(`kommo webhook ${res.status} ${(await res.text()).slice(0, 200)}`);
	} catch (e) {
		await writeLog(env, ref, "error_crm", body, { message: String(e).slice(0, 300) });
		return reply(502, false, { error: "crm", lead_ref: ref, data: { message: "Server error" } });
	}

	if (dKey && env.LEADS) {
		try {
			await env.LEADS.put(dKey, JSON.stringify({ ref, fp: fingerprint(body) }), { expirationTtl: DEDUPE_WINDOW_SEC });
		} catch (e) {
			console.error("dedupe write", String(e));
		}
	}
	await writeLog(env, ref, "accepted", body, { score });
	return reply(200, true, { lead_ref: ref });
}
