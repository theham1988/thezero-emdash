import type { APIRoute } from "astro";

// The old "the-zero-bang-tao-book" page was only a form. Visitors go to the matching form on the new site.
export const GET: APIRoute = ({ redirect }) => redirect("/bang-tao#contact", 301);
