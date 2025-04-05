import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  define: {
    "process.env.VITE_BLOG_API_KEY": JSON.stringify(
      process.env.VITE_BLOG_API_KEY
    ),
    "process.env.ENCRYPTION_SECRET": JSON.stringify(
      process.env.ENCRYPTION_SECRET
    ),
    "process.env.SMTP_HOST": JSON.stringify(process.env.SMTP_HOST),
    "process.env.SMTP_PORT": JSON.stringify(process.env.SMTP_PORT),
    "process.env.SMTP_SECURE": JSON.stringify(process.env.SMTP_SECURE),
    "process.env.SMTP_USER": JSON.stringify(process.env.SMTP_USER),
    "process.env.SMTP_PASSWORD": JSON.stringify(process.env.SMTP_PASSWORD),
    "process.env.SMTP_FROM_EMAIL": JSON.stringify(process.env.SMTP_FROM_EMAIL),
    "process.env.MAIL_SERVICE": JSON.stringify(process.env.MAIL_SERVICE),
    "process.env.MAIL_USER": JSON.stringify(process.env.MAIL_USER),
    "process.env.MAIL_PASSWORD": JSON.stringify(process.env.MAIL_PASSWORD),
  },
  server: {
    allowedHosts: [
      "nsd5xj-5173.csb.app",
      "localhost",
      "kcb-reports.vercel.app",
    ],
  },
});
