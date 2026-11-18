import type { APIRoute } from "astro";
import { trackingBody, trackingHead } from "../tracking";

/**
 * Serves a standalone landing page (src/landing/*.html) with the shared
 * site tracking injected at its two markers.
 */
export function landingRoute(page: string): APIRoute {
	const html = page
		.replace("<!--ZP_TRACKING_HEAD-->", trackingHead)
		.replace("<!--ZP_TRACKING_BODY-->", trackingBody);

	return ({ url }) => {
		const headers: Record<string, string> = {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		};
		// Keep the staging address out of Google until the real domain is live.
		if (url.hostname.endsWith(".workers.dev")) headers["X-Robots-Tag"] = "noindex, nofollow";
		return new Response(html, { headers });
	};
}
