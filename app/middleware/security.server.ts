import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

export async function securityHeaders({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains"
    );
  }

  return headers;
}

export async function rateLimit({ request }: LoaderFunctionArgs) {
  // Implement rate limiting logic here
  // Example: 5 reset attempts per hour per IP
  return null;
}
