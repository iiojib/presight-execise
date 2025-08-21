import { useEffect, useState } from "react";

import { Toggle } from "../components/Toggle";
import { Moon } from "../icons/Moon";
import { Sun } from "../icons/Sun";

export const ModeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    let mode = localStorage["darkMode"] !== undefined ? localStorage["darkMode"] === "true" : null;

    if (mode === null) {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setIsDarkMode(mode);
  }, []);

  if (isDarkMode === null) return null;

  const setMode = (value: boolean) => {
    setIsDarkMode(value);
    localStorage.setItem("darkMode", String(value));
    document.documentElement.classList.toggle("dark", value);
  };

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: ignore
    <label className="group flex place-items-center gap-1 text-gray-500">
      <span className="transition-colors text-white group-has-checked:text-gray-400">
        <Moon />
      </span>
      <Toggle checked={!isDarkMode} onChange={(checked) => setMode(!checked)} />
      <span className="transition-colors text-gray-500 group-has-checked:text-gray-900">
        <Sun />
      </span>
    </label>
  );
};
