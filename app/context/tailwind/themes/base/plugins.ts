// theme/base/plugins.ts
import { PluginAPI } from "tailwindcss/types/config";

const customPlugins = [
  function ({ addUtilities }: PluginAPI) {
    const newUtilities = {
      ".custom-box-shadow": {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    };
    addUtilities(newUtilities);
  },
];

export default customPlugins;
