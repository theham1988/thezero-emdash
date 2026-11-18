import type { APIRoute } from "astro";

/**
 * Lead endpoint for the Silhouette landing pages.
 *
 * On WordPress these forms posted to a PHP handler (admin-ajax.php, action
 * "zero_submit_lead") that checked reCAPTCHA and created the Kommo lead.
 * That handler does not exist here, and its Kommo mapping (pipeline, fields,
 * tags) is not visible from the page, so this endpoint refuses submissions
 * until the mapping is confirmed. The form shows its normal error message.
 */
export const POST: APIRoute = () =>
	new Response(
		JSON.stringify({ success: false, data: { message: "Lead form is not connected on this site yet." } }),
		{ status: 503, headers: { "Content-Type": "application/json" } },
	);
