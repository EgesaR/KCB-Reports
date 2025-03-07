module.exports = {
  content: [
    "node_modules/preline/dist/*.js",
  ],
  plugins: [require("preline/plugin")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
};
