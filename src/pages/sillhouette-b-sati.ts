import type { APIRoute } from "astro";

// This landing page was retired. Anything still pointing at it goes to /invest-sati, query string kept.
export const GET: APIRoute = ({ url, redirect }) => redirect(`/invest-sati${url.search}`, 301);
