import type { APIRoute } from "astro";
import page from "../landing/sati-dashboard.html?raw";

/**
 * SATI performance dashboard for The Zero Phuket, at /sati-dashboard.
 * The file is src/landing/sati-dashboard.html, exactly as the weekly dashboard
 * update produces it: replace that file and push to publish a new week.
 *
 * It is a report, not a site page: no site tracking, not in the sitemap, and
 * search engines are told not to list it. Anyone with the address can open it.
 */
export const prerender = false;

export const GET: APIRoute = () =>
	new Response(page, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"X-Robots-Tag": "noindex, nofollow",
			"Cache-Control": "no-cache",
		},
	});
