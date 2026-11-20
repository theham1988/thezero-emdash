import type { APIRoute } from "astro";

/**
 * Sitemap index: the fixed pages (sitemap-pages.xml, ours) and the posts
 * (sitemap-blog.xml, ours, built from the published posts).
 */
export const GET: APIRoute = ({ url }) => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url.origin}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${url.origin}/sitemap-blog.xml</loc>
  </sitemap>
</sitemapindex>
`;
	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};
