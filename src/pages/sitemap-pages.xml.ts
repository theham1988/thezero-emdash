import type { APIRoute } from "astro";

/**
 * Sitemap of the site's fixed pages. Posts are listed by EmDash in
 * /sitemap-posts.xml; /sitemap.xml links both. Add a path here when a new
 * fixed page is built. Landing pages for ads are left out on purpose.
 */
const PAGES = [
	"/", "/bang-tao", "/silhouette-nai-yang", "/silhouette-nai-yang/earth-residences", "/projects", "/london",
	"/about-us", "/gallery", "/rentals", "/rentals/the-zero-bang-tao", "/privileges",
	"/media", "/media/news", "/media/blogs", "/media/press",
	"/condo-phuket-beachfront", "/contact", "/pdpa-privacy-notice-terms",
];

export const GET: APIRoute = ({ url }) => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url>\n    <loc>${url.origin}${p}</loc>\n  </url>`).join("\n")}
</urlset>
`;
	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};
