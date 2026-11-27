import handler, {
	createScheduledHandler,
	EmDashRoom,
	EmDashRoomSite,
	PluginBridge,
} from "@emdash-cms/cloudflare/worker";

export { EmDashRoom, EmDashRoomSite, PluginBridge };

/** The one address the public site lives at. Its DNS is at Hostinger; see wrangler.jsonc. */
const LIVE_HOST = "thezerophuket.com";

/** Redirects carried over from Rank Math on the WordPress site (old address -> new address). */
const OLD_REDIRECTS: Record<string, string> = {
	"/d-ny": "/",
	"/ru/the-zero-bangtao-condo-hotel-ru": "/bang-tao/",
	"/ru/the-zero-bangtao-condo-hotel-ru__trashed": "/bang-tao/",
	"/ru/investor-proposal-ru": "/",
	"/investor-proposal": "/",
	"/index.php/investor-proposal": "/",
	"/hello-world": "/",
	"/sample-page": "/",
	"/ru/author/thezerobangtao-com": "/bang-tao/",
};

/**
 * WordPress addresses end in a slash ("/bang-tao/"), and that is what Google has indexed.
 * Every public page is shown at its slash address: the address without it forwards (301),
 * links inside pages point straight at the slash address, and the canonical tag matches.
 * Ad landing pages, files, the admin and the API are left as they are.
 */
const NO_SLASH_RULE = /^\/(api|_emdash|_astro|_image|_server|wp-content|images|js|lp-assets|invest-sati|live-sati|sati-dashboard)(\/|$)/;
const needsSlash = (path: string) => path !== "/" && !path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path) && !NO_SLASH_RULE.test(path);
const slashLink = (href: string | null): string | null => {
	if (!href) return null;
	const m = href.match(/^(https:\/\/thezerophuket\.com)?(\/[^?#]*)([?#].*)?$/);
	if (!m || href.startsWith("//") || !needsSlash(m[2])) return null;
	return `${m[1] ?? ""}${m[2]}/${m[3] ?? ""}`;
};

export default {
	...handler,
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// www forwards to the address without www, as the WordPress site did.
		if (url.hostname === `www.${LIVE_HOST}`) {
			return Response.redirect(`https://${LIVE_HOST}${url.pathname}${url.search}`, 301);
		}

		const old = OLD_REDIRECTS[url.pathname.replace(/\/+$/, "")];
		if (old) return Response.redirect(`${url.origin}${old}`, 301);

		let response = await handler.fetch!(request, env, ctx);

		const isPage = (request.method === "GET" || request.method === "HEAD") && !NO_SLASH_RULE.test(url.pathname);
		if (isPage) {
			// A redirect from the site itself lands on the slash address in one step.
			const loc = response.status >= 300 && response.status < 400 ? response.headers.get("Location") : null;
			if (loc) {
				const fixed = slashLink(loc.startsWith(url.origin) ? loc.slice(url.origin.length) : loc);
				if (fixed) return Response.redirect(new URL(fixed, url.origin).href, response.status);
			}
			const html = (response.headers.get("Content-Type") ?? "").includes("text/html");
			if (html && response.status === 200 && needsSlash(url.pathname)) {
				return Response.redirect(`${url.origin}${url.pathname}/${url.search}`, 301);
			}
			if (html && response.body) {
				response = new HTMLRewriter()
					.on("a[href]", { element(el) { const h = slashLink(el.getAttribute("href")); if (h) el.setAttribute("href", h); } })
					.transform(response);
			}
		}

		// Every other address this site answers on (the workers.dev staging address)
		// is kept out of search engines, so Google only ever lists the real domain.
		if (url.hostname !== LIVE_HOST && response.status !== 101) {
			const copy = new Response(response.body, response);
			copy.headers.set("X-Robots-Tag", "noindex, nofollow");
			return copy;
		}
		return response;
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
