/**
 * Site-wide tracking. Single source of truth for every page: the CMS layout
 * (Base.astro) and the standalone landing pages (src/landing/*.html) both
 * render these two snippets, so IDs only ever change here.
 *
 * Mirrors what thezerophuket.com/invest-sati ran on WordPress:
 * two GTM containers + the Google Ads global tag.
 */
export const GTM_IDS = ["GTM-PZ7QT22L", "GTM-KRW84GHM"] as const;
export const GOOGLE_ADS_ID = "AW-16593439829";

const gtmLoader = (id: string) =>
	`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;

/** Goes as high in <head> as possible. */
export const trackingHead = [
	`<script src="/js/zp-attribution.js"></script>`,
	`<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');</script>`,
	`<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}"></script>`,
	...GTM_IDS.map((id) => `<script>${gtmLoader(id)}</script>`),
].join("");

/** Goes immediately after the opening <body> tag. */
export const trackingBody = GTM_IDS.map(
	(id) =>
		`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
).join("");
