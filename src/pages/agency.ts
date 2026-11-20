import type { APIRoute } from "astro";

// This page of the old WordPress site was not rebuilt. Visitors go to the home page.
export const GET: APIRoute = ({ redirect }) => redirect("/", 301);
