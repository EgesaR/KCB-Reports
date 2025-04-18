import { IThemeColors, IThemeVariables } from "../types";

// Define static colors that will have the same value for all apps
const staticColors = {
  // Example static colors (optional)
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
  transparent: "transparent",
};

// Define configurable colors using CSS variables
const configurableColors: IThemeColors = {
  "accent-1": withOpacity("--color-accent-1"),
  primary: withOpacity("--color-primary"),
  secondary: withOpacity("--color-secondary"),
  danger: withOpacity("--color-danger"),
  text: {
    DEFAULT: withOpacity("--color-text"),
    secondary: withOpacity("--color-text-secondary"),
  },
  border: withOpacity("--color-border"),
  background: {
    DEFAULT: withOpacity("--color-bg"),
    secondary: withOpacity("--color-bg-secondary"),
    surface: withOpacity("--color-surface"),
  },
};

/**
 * Helper function to generate RGBA values with alpha transparency.
 * @param variableName - The name of the CSS variable (e.g., "--color-accent-1").
 * @returns A string in the format `rgba(var(--color-variable), <alpha-value>)`.
 */
function withOpacity(variableName: keyof IThemeVariables): string {
  return `rgba(var(${variableName}), <alpha-value>)`;
}

// Combine static and configurable colors into a single object
const colors = { ...staticColors, ...configurableColors };

export default colors;
