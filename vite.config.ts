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
    "process.env.env.VITE_BLOG_API_KEY": JSON.stringify(
      process.env.VITE_BLOG_API_KEY
    ),
  },
  server: {
    allowedHosts: [
      "m366kz-5173.csb.app",
      "localhost",
      "kcb-reports.vercel.app",
    ],
  },
});
