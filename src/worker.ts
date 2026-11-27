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

		const response = await handler.fetch!(request, env, ctx);

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
