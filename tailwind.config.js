import withMT from "@material-tailwind/react/utils/withMT";
import pkg from "@material-tailwind/react";
const { ThemeProvider } = pkg;
const prelinePlugin = require("preline/plugin");

module.exports = withMT({
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "node_modules/preline/dist/*.js",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [prelinePlugin],
});
