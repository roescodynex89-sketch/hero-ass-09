"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl border border-white/10 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-accent-cyan dark:hover:border-accent-cyan transition-all duration-300 cursor-pointer flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <FiSun className="w-5 h-5 text-accent-cyan" />
      ) : (
        <FiMoon className="w-5 h-5 text-accent-purple" />
      )}
    </button>
  );
}
