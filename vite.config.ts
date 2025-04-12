import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  define: {
    "process.env.ENCRYPTION_SECRET": JSON.stringify(
      process.env.ENCRYPTION_SECRET
    ),
    // Email configuration
    "process.env.MAIL_USER": JSON.stringify(process.env.MAIL_USER),
    "process.env.MAIL_PASSWORD": JSON.stringify(process.env.MAIL_PASSWORD),
    "process.env.MAIL_SERVICE": JSON.stringify(process.env.MAIL_SERVICE),
    "process.env.SMTP_HOST": JSON.stringify(process.env.SMTP_HOST),
    "process.env.SMTP_PORT": JSON.stringify(process.env.SMTP_PORT),
    "process.env.SMTP_SECURE": JSON.stringify(process.env.SMTP_SECURE),
    "process.env.SMTP_FROM_EMAIL": JSON.stringify(process.env.SMTP_FROM_EMAIL),
    "process.env.GMAIL_CLIENT_ID": JSON.stringify(process.env.GMAIL_CLIENT_ID),
    "process.env.IO": JSON.stringify(process.env.IO),
    "process.env.GMAIL_CLIENT_SECRET": JSON.stringify(
      process.env.GMAIL_CLIENT_SECRET
    ),
    "process.env.GMAIL_REFRESH_TOKEN": JSON.stringify(
      process.env.GMAIL_REFRESH_TOKEN
    ),
    "process.env.GMAIL_USER": JSON.stringify(process.env.GMAIL_USER),
    // Add any other required environment variables
    "process.env.VITE_BLOG_API_KEY": JSON.stringify(
      process.env.VITE_BLOG_API_KEY
    ),
    "process.env.GOOGLE_REDIRECT_URI": JSON.stringify(
      // Consistent naming
      process.env.GOOGLE_REDIRECT_URI
    ),
    "process.env.OAUTH_TOKEN_URL": JSON.stringify(
      // Added token URL
      process.env.OAUTH_TOKEN_URL
    ),
    // AUTHORIZATION_CODE is typically handled in the callback route, not as a build-time env var
  },
  server: {
    allowedHosts: [
      "jjnmq2-5173.csb.app",
      "localhost",
      "kcb-reports.vercel.app",
    ],
  },
});
