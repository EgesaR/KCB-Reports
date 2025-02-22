module.exports = {
  content: ["./node_modules/preline/preline.js"],
  plugins: [require("preline/plugin")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
};
