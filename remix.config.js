/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: "./server.js",
  serverBuildPath: "build/index.js",
  serverDependenciesToBundle: "all",
  ignoredRouteFiles: ["**/.*"],
};
