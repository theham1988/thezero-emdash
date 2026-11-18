import type { APIRoute } from "astro";

// Old WordPress category archives -> the new listings.
const MAP: Record<string, string> = { blog: "/media/blogs", news: "/media/news" };

export const GET: APIRoute = ({ params, redirect }) => redirect(MAP[params.slug ?? ""] ?? "/media", 301);
