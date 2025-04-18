import { IThemeRGB } from "../types";

// Define the RGB values for the hosted theme
export const tailwindColorTheme: IThemeRGB = {
  "rgb-accent-1": "237, 137, 54", // ld-orange (primary accent color)
  "rgb-primary": "69, 89, 164", // ld-blue (primary brand color)
  "rgb-secondary": "120, 144, 156", // ld-gray (secondary color)
  "rgb-danger": "211, 47, 47", // ld-red (error/danger color)
  "rgb-text": "52, 71, 103", // ld-dark-blue (default text color)
  "rgb-text-secondary": "134, 142, 150", // ld-light-gray (secondary text color)
  "rgb-border": "227, 232, 237", // ld-light-gray-border (border color)
  "rgb-bg": "255, 255, 255", // ld-white (default background color)
  "rgb-bg-secondary": "247, 249, 250", // ld-light-gray-bg (secondary background color)
  "rgb-surface": "250, 250, 250", // ld-light-gray-surface (surface color)
};

// Export the theme as the default export for convenience
export default tailwindColorTheme;
