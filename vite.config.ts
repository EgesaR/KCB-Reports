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
    // Client-side environment variables (non-sensitive)
    "process.env.ENCRYPTION_SECRET": JSON.stringify(
      process.env.ENCRYPTION_SECRET
    ),
    "process.env.GOOGLE_REDIRECT_URI": JSON.stringify(
      process.env.GOOGLE_REDIRECT_URI
    ),
    "process.env.OAUTH_TOKEN_URL": JSON.stringify(process.env.OAUTH_TOKEN_URL),
    "process.env.VITE_BLOG_API_KEY": JSON.stringify(
      process.env.VITE_BLOG_API_KEY
    ),
    "process.env.CLIENT_ID": JSON.stringify(process.env.CLIENT_ID),
    "process.env.CLIENT_SECRET": JSON.stringify(process.env.CLIENT_SECRET),
    "process.env.VITE_MAIL_USER": JSON.stringify(process.env.VITE_MAIL_USER),
  },
  server: {
    allowedHosts: [
      "drydl8-5173.csb.app",
      "localhost",
      "kcb-reports.vercel.app",
    ],
  },
});
