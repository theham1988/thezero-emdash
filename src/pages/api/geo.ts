import type { APIRoute } from "astro";

/**
 * The visitor's country (two letters), as Cloudflare sees it. Used by the
 * phone field (public/js/zp-phone.js) to pre-select the country code.
 * Also reports the build marker used to confirm a deploy went out.
 */
export const prerender = false;

export const GET: APIRoute = ({ request }) => {
	const cf = (request as Request & { cf?: { country?: string } }).cf;
	const country = cf?.country || request.headers.get("cf-ipcountry") || "";
	return new Response(JSON.stringify({ country, build: "dash-1" }), {
		headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
	});
};
