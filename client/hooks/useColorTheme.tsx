import { useContext } from "react";
import { GlobalContext } from "../pages/_app";
import { COLORS, KEY_COLOR, COLOR_MODE } from "../config/colors";

export const useColorTheme = () => {
  const { isDarkMode, setIsDarkMode } = useContext(GlobalContext);

  const updateColors = (): any => {
    let theme: any = localStorage.getItem("theme");
    if (!theme) {
      theme = "DAY";
      return theme;
    }
    handleColorChange(theme);
    return theme;
  };

  const handleColorChange = (newTheme?: COLOR_MODE) => {
    // Change Local Storage
    const newMode: COLOR_MODE = newTheme
      ? newTheme
      : isDarkMode
      ? "DAY"
      : "NIGHT";
    localStorage.setItem("theme", newMode);

    // First change vars
    changeVarsInCSS(newMode);

    // Then change state
    if (!newTheme && setIsDarkMode) setIsDarkMode(prev => !prev);
  };

  const changeVarsInCSS = (newMode: COLOR_MODE) => {
    const rootElement: any = document.querySelector(":root");

    if (!rootElement) return;

    for (let i = 0; i < Object.keys(COLORS).length; i++) {
      const key: string = Object.keys(COLORS)[i];
      const property = COLORS[key as KEY_COLOR];
      const value: string = property[newMode];

      rootElement.style.setProperty(key, value);
    }
  };

  return { handleColorChange, updateColors };
};
