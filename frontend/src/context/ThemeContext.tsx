"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";
type BrandStyle = "okc" | "linkedin";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  brandStyle: BrandStyle;
  toggleBrandStyle: () => void;
  setBrandStyle: (style: BrandStyle) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  brandStyle: "okc",
  toggleBrandStyle: () => {},
  setBrandStyle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [brandStyle, setBrandStyleState] = useState<BrandStyle>("okc");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("okc-theme") as Theme | null;
    const savedBrand = localStorage.getItem("okc-brand-style") as BrandStyle | null;
    
    const preferredTheme = savedTheme || "dark";
    const preferredBrand = savedBrand || "okc";
    
    setTheme(preferredTheme);
    setBrandStyleState(preferredBrand);
    
    document.documentElement.setAttribute("data-theme", preferredTheme);
    document.documentElement.setAttribute("data-brand", preferredBrand);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("okc-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-brand", brandStyle);
    localStorage.setItem("okc-brand-style", brandStyle);
  }, [brandStyle, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleBrandStyle = () => setBrandStyleState((b) => (b === "okc" ? "linkedin" : "okc"));
  const setBrandStyle = (style: BrandStyle) => setBrandStyleState(style);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, brandStyle, toggleBrandStyle, setBrandStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
