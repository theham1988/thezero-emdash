import type { APIRoute } from "astro";

/**
 * The visitor's country (two letters), as Cloudflare sees it. Used by the
 * phone field (public/js/zp-phone.js) to pre-select the country code.
 */
export const prerender = false;

export const GET: APIRoute = ({ request }) => {
	const cf = (request as Request & { cf?: { country?: string } }).cf;
	const country = cf?.country || request.headers.get("cf-ipcountry") || "";
	return new Response(JSON.stringify({ country }), {
		headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
	});
};
