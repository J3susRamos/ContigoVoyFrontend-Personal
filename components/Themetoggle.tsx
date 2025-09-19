"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Icons } from "@/icons";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Show a placeholder while loading to prevent hydration errors
  if (!mounted) {
    return (
      <label htmlFor="theme-toggle" className="relative inline-block w-16 h-8" style={{marginLeft: '12px'}}>
        <span className="absolute h-[33px] cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#9494F3] rounded-md">
          <span className="absolute h-[33px] w-[33px] bg-[#634AE2] rounded-md transform translate-x-0"></span>
        </span>
      </label>
    );
  }

  return (
    <>
      <label htmlFor="theme-toggle" className="relative inline-block w-16 h-8" style={{marginLeft: '12px'}}>
        <span id="theme-label" className="sr-only">
          Alternar modo oscuro
        </span>

        <input
          type="checkbox"
          id="theme-toggle"
          className="sr-only"
          role="switch"
          aria-checked={theme === "light"}
          checked={theme === "light"}
          onChange={toggleTheme}
          aria-labelledby="theme-label"
        />

        <span
          className={`absolute h-[33px] cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-1500 rounded-md ${
            theme === "light" ? "bg-[#9494F3]" : "bg-[#9494F3]"
          }`}
        >
          <span
            className={`absolute h-[33px] w-[33px] bg-[#634AE2] rounded-md transform transition-all duration-150 ${
              theme === "light" ? "translate-x-8" : "translate-x-0"
            }`}
          ></span>
        </span>

        <span
          className="sun absolute top-1/2 right-[2px] z-10 w-6 h-6 transition-all duration-1500 transform -translate-y-1/2"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: Icons.sun }}
        ></span>

        <span
          className="moon absolute top-1/2 left-2 z-10 w-6 h-6 transition-all duration-1500 transform -translate-y-1/2"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: Icons.moon }}
        ></span>
      </label>
    </>
  );
}
