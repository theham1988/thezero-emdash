import type { APIRoute } from "astro";

// The old "home-previous" page was only a form. Visitors go to the matching form on the new site.
export const GET: APIRoute = ({ redirect }) => redirect("/", 301);
