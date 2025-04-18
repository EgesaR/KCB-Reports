import React, { createContext, useEffect, useMemo, useContext } from "react";
import { IThemeRGB } from "../types";
import applyTheme from "./applyTheme";

// Define Props for the ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
  themeRGB?: IThemeRGB; // Optional themeRGB passed as a prop
}

// Define the context type
interface ThemeContextType {
  themeRGB: IThemeRGB; // The current theme's RGB values
}

// Create the ThemeContext with default values
const ThemeContext = createContext<ThemeContextType>({
  themeRGB: {}, // Default to an empty object if no theme is provided
});

// Export a custom hook to access the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// ThemeProvider Component
export default function ThemeProvider({
  children,
  themeRGB,
}: ThemeProviderProps) {
  // Apply the theme whenever `themeRGB` changes
  useEffect(() => {
    if (themeRGB) {
      applyTheme(themeRGB); // Apply the theme using the provided RGB values
    }
  }, [themeRGB]); // Add `themeRGB` to the dependency array for reactivity

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => {
    return { themeRGB: themeRGB || {} }; // Ensure `themeRGB` is never undefined
  }, [themeRGB]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
