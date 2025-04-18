import merge from "deepmerge";
import { Config } from "tailwindcss";
import colors from "./themes/base/colors";
import plugins from "./themes/base/plugins";
import typography from "./themes/base/typography";

// Default Tailwind configuration for @dolthub/react-components
const reactComponentsTailwindConfig: Config = {
  plugins,
  theme: {
    extend: {
      transitionProperty: { width: "width" }, // Add custom transition property
      gradientColorStops: colors, // Extend gradient color stops
      colors, // Extend colors
      fontFamily: typography, // Extend font family
      //screens: breakpoints, // Extend breakpoints
    },
  },
};

/**
 * Merge @dolthub/react-components and Tailwind CSS configurations.
 * Ensures that user-provided configurations override the defaults.
 *
 * @param tailwindConfig - The user-provided Tailwind configuration.
 * @returns A merged Tailwind configuration object.
 */
export function mergeConfig(tailwindConfig: Config): Config {
  // Use deepmerge to combine configurations, prioritizing user-provided values
  const merged = merge(reactComponentsTailwindConfig, tailwindConfig, {
    arrayMerge: (destinationArray, sourceArray) => sourceArray, // Overwrite arrays instead of concatenating
  });

  return merged;
}
