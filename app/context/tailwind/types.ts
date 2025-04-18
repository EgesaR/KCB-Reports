// Defines the color channels. Passed to the context from each app.
// i.e. {"rgb-accent-1": "252 66 201"}
export interface IThemeRGB {
  [key: `rgb-${string}`]: string; // Dynamic keys for RGB values (e.g., "rgb-accent-1", "rgb-primary")
}

// Name of the CSS variables used in tailwind.config.ts
export interface IThemeVariables {
  [key: `--color-${string}`]: string; // Dynamic keys for CSS variables (e.g., "--color-accent-1", "--color-primary")
}

// Name of the defined colors in the Tailwind theme
export interface IThemeColors {
  [key: string]: string | IThemeColors; // Allow nested objects or strings
}
