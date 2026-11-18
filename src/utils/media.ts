/**
 * Images imported from WordPress keep their original URLs
 * (https://thezerophuket.com/wp-content/uploads/...). The same files are
 * served by this site at the same path, so we link to them relatively: it
 * works on staging now and on the real domain after the DNS switch.
 */
const WP_ORIGINS = ["https://thezerophuket.com", "http://thezerophuket.com", "https://www.thezerophuket.com"];

export function localUrl(url: string | null | undefined): string | undefined {
	if (!url) return undefined;
	for (const origin of WP_ORIGINS) {
		if (url.startsWith(`${origin}/wp-content/`)) {
			// File names are stored ASCII-only on this site (an em dash becomes a hyphen).
			return encodeURI(decodeURI(url.slice(origin.length)).replace(/[\u2013\u2014]/g, "-"));
		}
	}
	return url;
}

type ImageLike = { src?: string | null; previewUrl?: string | null; alt?: string | null; id?: string; provider?: string; meta?: Record<string, unknown> } | null | undefined;

/** URL for an EmDash image field, whether external (imported) or in the media library. */
export function imageUrl(image: ImageLike): string | undefined {
	if (!image) return undefined;
	if (image.src) return localUrl(image.src);
	if ((image.provider ?? "local") !== "local") return image.previewUrl ?? undefined;
	const key = typeof image.meta?.storageKey === "string" ? image.meta.storageKey : image.id;
	return key ? `/_emdash/api/media/file/${key}` : undefined;
}

/** Rewrite image URLs inside imported Portable Text. */
export function localizeContent<T>(blocks: T[] | null | undefined): T[] {
	return (blocks ?? []).map((block: any) => {
		if (block?._type === "image" && block.asset?.url) {
			return { ...block, asset: { ...block.asset, url: localUrl(block.asset.url) } };
		}
		return block;
	});
}

/** First paragraph of a post, for cards and meta descriptions. */
export function firstParagraph(blocks: any[] | null | undefined, max = 170): string {
	for (const block of blocks ?? []) {
		if (block?._type !== "block" || block.style !== "normal" || block.listItem) continue;
		const text = (block.children ?? []).map((c: any) => c.text ?? "").join("").trim();
		if (text.length < 40) continue;
		return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
	}
	return "";
}

export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "";
	return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
