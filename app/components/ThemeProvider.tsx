// app/components/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to validate theme value
const getValidTheme = (
  storedTheme: string | null
): "light" | "dark" | "system" => {
  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }
  return "system";
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: "light" | "dark" | "system";
}> = ({ children, initialTheme = "system" }) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    initialTheme === "dark"
  );

  useEffect(() => {
    const savedTheme = getValidTheme(localStorage.getItem("theme"));
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (theme !== "system") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      document.cookie = `theme=${
        isDarkMode ? "dark" : "light"
      }; path=/; max-age=31536000; SameSite=Lax; Secure`;
    } else {
      localStorage.removeItem("theme");
      document.cookie = `theme=system; path=/; max-age=31536000; SameSite=Lax; Secure`;
    }
  }, [isDarkMode, theme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    setTheme((prev) =>
      prev === "system"
        ? !isDarkMode
          ? "dark"
          : "light"
        : !isDarkMode
        ? "dark"
        : "light"
    );
  };

  const setThemeMode = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (newTheme === "system") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDarkMode(newTheme === "dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, setTheme: setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
