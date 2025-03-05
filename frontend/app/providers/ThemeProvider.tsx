"use client";
import { useCallback, type PropsWithChildren, useEffect, createContext, useContext } from "react";
import { useLocalStorage } from "react-use";
import { HeroUIProvider } from "@heroui/react";

interface AppStatus {
  theme: "dark" | "light";
  changeTheme: (curr: "dark" | "light") => void;
}

const AppContext = createContext<AppStatus | null>(null);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme");

  useEffect(() => {
    const systemTheme = window?.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(systemTheme ? systemTheme : "dark");
  }, [theme, setTheme]);

  const changeTheme = useCallback(
    (curr: "dark" | "light") => {
      setTheme(curr);
    },
    [setTheme],
  );

  return (
    <AppContext.Provider value={{ theme, changeTheme } as AppStatus}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within a ThemeProvider");

  return context;
};
