import {
  type NextFunction,
  type Request,
  type Response,
} from "@remix-run/node";

export async function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains"
    );
  }

  await next();
}

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Implement rate limiting logic here
  // Example: 5 reset attempts per hour per IP
  await next();
}
