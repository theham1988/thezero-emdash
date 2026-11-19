/**
 * The Zero Phuket lead gateway - configuration.
 * The only file to edit when a form is added or the Kommo setup changes.
 *
 * Modelled on the SATI Lead Gateway used for Sudara, with Kommo (through the
 * Kwid webhook) in place of Pipedrive. Kept inside this site's Worker so the
 * forms post to their own domain: no CORS, and the webhook address never
 * appears in a page.
 */

/** reCAPTCHA Enterprise site key used by every Zero form, and the action the forms send. */
export const RECAPTCHA = { siteKey: "6Ldwts0sAAAAAJyCO0rUaBgYx5eiQM4voxaURbmV", action: "submit_lead" };
export const RECAPTCHA_THRESHOLD = 0.3;

/** One person (email or phone) = one lead inside this window. */
export const DEDUPE_WINDOW_SEC = 600;
export const LOG_TTL_SEC = 60 * 60 * 24 * 180;

/** Kommo, reached through the Kwid webhook - the same target /invest-sati posts to. */
export const KOMMO = {
	webhook:
		"https://data.widgets.wearekwid.com/api/webhook/33730819/374a68ae75fbccee3f35a0f97f0c0d84e28a7d66699039acf73823192c17743e",
	pipelineId: 9914723,
	// Lead custom field ids (Kommo > Settings > Fields)
	fields: {
		property: "1313037",
		unitType: "1313039",
		goal: "1313041",
		variant: "1313043",
		utmCampaign: "1313045",
		utmSource: "1313047",
	},
};

export const LANGUAGES: Record<string, string> = {
	en: "English",
	ru: "Russian",
	ar: "Arabic",
	zh: "Chinese",
	"zh-CN": "Chinese",
	he: "Hebrew",
	th: "Thai",
	pl: "Polish",
};

export interface FormConfig {
	/** Shown in the Kommo lead's metadata. */
	formName: string;
	/** Tags added before the project, language and campaign tags. */
	tags: string[];
	/** Fixed project for single-project forms. Forms with a project question leave it out. */
	project?: ProjectKey;
	/** Name of the hidden spam-trap field on the form. */
	honeypot: string;
}

export type ProjectKey = "bangtao" | "naiyang" | "both";

export const PROJECTS: Record<ProjectKey, { property: string; tag: string }> = {
	bangtao: { property: "The Zero Bangtao", tag: "Pref Bang Tao" },
	naiyang: { property: "The Zero Nai Yang", tag: "Pref Nai Yang" },
	both: { property: "Both Projects", tag: "Pref Both" },
};

/** Answers the home page's "Project of interest" select can send. */
export const PROJECT_ANSWERS: Record<string, ProjectKey> = {
	"Silhouette by The Zero": "naiyang",
	"The Zero Bang Tao": "bangtao",
	"Both / not sure yet": "both",
};

export const FORMS: Record<string, FormConfig> = {
	// Home page contact form: organic ("SEO") and other non-landing-page leads.
	// The gateway adds a channel tag (SEO, Direct, Referral, Social, Paid Search) from how the visitor arrived.
	website_home: {
		formName: "The Zero Phuket - Website Homepage",
		tags: ["Website", "Homepage"],
		honeypot: "company",
	},
	// Project pages
	website_bangtao: {
		formName: "The Zero Phuket - Website Bang Tao Page",
		tags: ["Website", "Bang Tao Page"],
		project: "bangtao",
		honeypot: "company",
	},
	website_naiyang: {
		formName: "The Zero Phuket - Website Silhouette Nai Yang Page",
		tags: ["Website", "Nai Yang Page"],
		project: "naiyang",
		honeypot: "company",
	},
};

/** Search engines whose referrals count as organic search ("SEO"). */
export const SEARCH_ENGINES = ["google.", "bing.com", "yandex.", "baidu.com", "duckduckgo.com", "yahoo.", "ecosia.org", "brave.com", "naver.com", "sogou.com"];
export const SOCIAL_SITES = ["facebook.com", "instagram.com", "t.co", "twitter.com", "x.com", "linkedin.com", "youtube.com", "tiktok.com", "line.me", "vk.com", "t.me", "pinterest."];
