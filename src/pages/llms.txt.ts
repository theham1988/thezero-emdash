import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

/** /llms.txt, as Rank Math published on WordPress: the site's pages and posts for AI assistants. */
export const prerender = false;

const PAGES: [string, string][] = [
	["/", "The Zero Phuket - sustainable condominiums in Bang Tao and Nai Yang, Phuket"],
	["/bang-tao/", "The Zero Bang Tao - new condo for sale in Bang Tao, Phuket"],
	["/silhouette-nai-yang/", "Silhouette by The Zero Phuket - new condo for sale in Nai Yang Beach"],
	["/silhouette-nai-yang/earth-residences/", "Earth Residences at Silhouette, Nai Yang"],
	["/projects/", "Projects"], ["/london/", "The Zero London"], ["/about-us/", "About Us"],
	["/gallery/", "Gallery"], ["/rentals/", "Rentals"], ["/privileges/", "Privileges"],
	["/media/", "Media"], ["/contact/", "Contact"],
];

export const GET: APIRoute = async ({ url }) => {
	const { entries } = await (getEmDashCollection as any)("posts", { status: "published", orderBy: { published_at: "desc" }, limit: 50 });
	const lines = [
		"# The Zero Phuket", "",
		"> Award-winning, EIA-approved sustainable condominiums in Bang Tao and Nai Yang, Phuket, by a British-led developer.", "",
		"## Pages", ...PAGES.map(([p, t]) => `- [${t}](${url.origin}${p})`), "",
		"## Posts", ...(entries as any[]).map((e) => `- [${String(e.data.title).trim()}](${url.origin}/${e.id}/)`), "",
	];
	return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};
