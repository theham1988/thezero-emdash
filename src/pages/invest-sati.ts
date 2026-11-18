import type { APIRoute } from "astro";
import page from "../landing/invest-sati.html?raw";
import { trackingBody, trackingHead } from "../tracking";

/**
 * /invest-sati - the standalone Google Ads landing page, carried over from
 * WordPress as-is. The HTML lives in src/landing/invest-sati.html; the shared
 * tracking snippets are injected at the two markers.
 */
const html = page
	.replace("<!--ZP_TRACKING_HEAD-->", trackingHead)
	.replace("<!--ZP_TRACKING_BODY-->", trackingBody);

export const GET: APIRoute = ({ url }) => {
	const headers: Record<string, string> = {
		"Content-Type": "text/html; charset=utf-8",
		"Cache-Control": "public, max-age=300",
	};
	// Keep the staging address out of Google until the real domain is live.
	if (url.hostname.endsWith(".workers.dev")) {
		headers["X-Robots-Tag"] = "noindex, nofollow";
	}
	return new Response(html, { headers });
};
