import type { APIRoute } from "astro";

/**
 * robots.txt at the address that was asked for, so the real domain points
 * Google to its own sitemap (EmDash's default always names the staging address).
 */
export const prerender = false;

export const GET: APIRoute = ({ url }) =>
	new Response(`User-agent: *\nAllow: /\n\n# Admin and API\nDisallow: /_emdash/\n\nSitemap: ${url.origin}/sitemap.xml\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
	});
