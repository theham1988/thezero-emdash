import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

/**
 * Sitemap of the published posts, at the address the visitor (or Google) asked
 * on. EmDash's own /sitemap-posts.xml always uses the address the site was
 * first set up on (the workers.dev staging address), so the public sitemap
 * index links here instead.
 */
export const prerender = false;

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async ({ url }) => {
	const { entries } = await (getEmDashCollection as any)("posts", {
		status: "published",
		orderBy: { published_at: "desc" },
		limit: 1000,
	});
	const rows = (entries as any[]).map((e) => {
		const when = e.data.updated_at ?? e.data.updatedAt ?? e.data.published_at ?? e.data.publishedAt;
		const date = when ? new Date(when) : null;
		const lastmod = date && !Number.isNaN(date.getTime()) ? `\n    <lastmod>${date.toISOString()}</lastmod>` : "";
		return `  <url>\n    <loc>${xml(`${url.origin}/${e.id}`)}</loc>${lastmod}\n  </url>`;
	});
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.join("\n")}
</urlset>
`;
	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};
