import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 8000,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  optimizeDeps: {
   //exclude: [
     //"react-icons/fa",
     // "react-icons/ci",
     // "react-icons/io",
     // "react-icons/pi",
     // "react-icons/fi",
     // "react-icons/ri",
     // "react-icons/bs",
     // "react-icons/md",
     // "react-icons/cg",
     // "react-use-measure",
     // "tailwind-merge",
     // "@headlessui/react",
    //],
  },
  build: {
    rollupOptions: {
      onLog(level, log) {
        if (log.message.includes("Failed to parse source")) {
          console.error("Import analysis error:", log);
        }
      },
    },
  },
});