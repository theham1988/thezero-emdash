import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleLead, type GatewayEnv } from "../../lead-gateway/gateway";

/**
 * POST /api/lead - entry point of the lead gateway (src/lead-gateway).
 * Accepts the landing pages' form posts (multipart) and JSON.
 */
export const POST: APIRoute = async ({ request }) => {
	const body: Record<string, string> = {};
	try {
		const type = request.headers.get("content-type") || "";
		if (type.includes("application/json")) {
			const raw = (await request.json()) as Record<string, unknown>;
			for (const [k, v] of Object.entries(raw)) if (v != null && typeof v !== "object") body[k] = String(v);
		} else {
			const form = await request.formData();
			for (const [k, v] of form.entries()) if (typeof v === "string") body[k] = v;
		}
	} catch {
		return Response.json({ success: false, ok: false, error: "bad_request", data: { message: "Bad request." } }, { status: 400 });
	}
	body._ip = request.headers.get("cf-connecting-ip") || "";

	const result = await handleLead(env as unknown as GatewayEnv, body);
	return Response.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
};
