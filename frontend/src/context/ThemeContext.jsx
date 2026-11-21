import { createContext, useContext, useEffect, useState } from "react";

const ThemeProvider = createContext();

export function ThemeContext({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <ThemeProvider.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeProvider.Provider>
    </>
  );
}

export function useTheme() {
  return useContext(ThemeProvider);
}
