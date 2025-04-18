import { IThemeRGB, IThemeVariables } from "../types";

/**
 * Applies the provided theme RGB values to the document's root element as CSS variables.
 * @param themeRGB - An object containing RGB values for the theme (e.g., {"rgb-accent-1": "252 66 201"}).
 */
export default function applyTheme(themeRGB: IThemeRGB) {
  const themeObject: IThemeVariables = mapTheme(themeRGB);
  const root = document.documentElement;

  // Apply each CSS variable to the document's root element
  Object.entries(themeObject).forEach(([variableName, rgbValue]) => {
    if (!validateRGB(rgbValue)) {
      throw new Error(`Invalid RGB value for ${variableName}: ${rgbValue}`);
    }

    root.style.setProperty(variableName, rgbValue);
  });
}

/**
 * Maps the RGB theme values to their corresponding CSS variable names.
 * @param rgb - An object containing RGB values (e.g., {"rgb-accent-1": "252 66 201"}).
 * @returns An object mapping CSS variable names to their RGB values.
 */
function mapTheme(rgb: IThemeRGB): IThemeVariables {
  const themeVariables: Partial<IThemeVariables> = {};

  // Dynamically map each RGB key to its corresponding CSS variable
  (Object.keys(rgb) as Array<keyof IThemeRGB>).forEach((key) => {
    if (key.startsWith("rgb-")) {
      const cssVariableName = `--color-${key.slice(4)}`; // Convert "rgb-accent-1" to "--color-accent-1"
      themeVariables[cssVariableName as keyof IThemeVariables] =
        rgb[key]?.replace(/\s+/g, ", ") || "";
    }
  });

  return themeVariables as IThemeVariables;
}

/**
 * Validates an RGB string to ensure it follows the correct format.
 * @param rgb - A string representing an RGB value (e.g., "252, 66, 201").
 * @returns True if the RGB value is valid, otherwise false.
 */
function validateRGB(rgb: string): boolean {
  if (!rgb) return true; // Allow empty values (optional)
  const rgbRegex = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/;
  return rgbRegex.test(rgb);
}
