import type { APIRoute } from "astro";

// The old "silhouette-nai-yang_old" page was only a form. Visitors go to the matching form on the new site.
export const GET: APIRoute = ({ redirect }) => redirect("/silhouette-nai-yang", 301);
