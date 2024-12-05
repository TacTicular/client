import { useState, createContext, useContext } from "react";

export const ThemeContext = createContext({
  currentTheme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("light");

  const themes = {
    light: {
      navbar: "bg-gradient-to-r from-blue-400 via-purple-350 to-pink-500",
      text: "text-gray-800",
      button: "bg-blue-500 text-white ",
      background: "bg-gradient-to-r from-teal-200 via-indigo-200 to-purple-200",
    },
    dark: {
      navbar: "bg-gradient-to-r from-black via-gray-800 to-blue-800",
      text: "text-gray-200",
      button: "bg-gray-700 text-gray-300 ",
      background: "bg-gray-900",
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: setCurrentTheme,
        theme: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
