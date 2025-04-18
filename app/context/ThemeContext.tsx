import React, { createContext, useState, useEffect } from "react";

type Theme = "LIGHT" | "DARK" | "SYSTEM";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "LIGHT",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("LIGHT");

  // Apply theme dynamically
  useEffect(() => {
    const applyTheme = (themeToApply: Theme) => {
      if (themeToApply === "SYSTEM") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "DARK"
          : "LIGHT";
        document.documentElement.setAttribute(
          "data-theme",
          systemTheme.toLowerCase()
        );
      } else {
        document.documentElement.setAttribute(
          "data-theme",
          themeToApply.toLowerCase()
        );
      }
    };

    applyTheme(theme);

    // Watch for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "SYSTEM") {
        applyTheme(e.matches ? "DARK" : "LIGHT");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
