/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: "./server.js",
  serverBuildPath: "build/index.js",
  serverDependenciesToBundle: "all",
  ignoredRouteFiles: ["**/.*"],
  mdx: async () => {},
  async webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
