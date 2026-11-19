import type { APIRoute } from "astro";

// The old "zero-nai-yang-brochure" page was only a form. Visitors go to the matching form on the new site.
export const GET: APIRoute = ({ redirect }) => redirect("/silhouette-nai-yang#contact", 301);
