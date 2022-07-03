import styles from "./Colors.module.scss";
import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import { COLORS, KEY_COLOR, COLOR_MODE } from "../../config/colors";

type Props = {
  callback?: () => any;
};

const Colors = ({ callback }: Props) => {
  const { isDarkMode, setIsDarkMode } = useContext(GlobalContext);

  const handleColorChange = () => {
    // First change vars
    changeVarsInCSS();

    // Then change state
    if (setIsDarkMode) setIsDarkMode(prev => !prev);
  };

  const changeVarsInCSS = () => {
    const rootElement: any = document.querySelector(":root");

    if (!rootElement) return;

    for (let i = 0; i < Object.keys(COLORS).length; i++) {
      const key: string = Object.keys(COLORS)[i];
      const newMode: COLOR_MODE = isDarkMode ? "DAY" : "NIGHT";
      const property = COLORS[key as KEY_COLOR];
      const value: string = property[newMode];

      rootElement.style.setProperty(key, value);
    }
  };

  return (
    <div className={styles.color} onClick={callback}>
      <div
        onClick={handleColorChange}
        className={styles.color_pill}
        title="Toggle mode"
      >
        <div
          className={`${styles.color_pill_circle} ${
            isDarkMode ? styles.dark : styles.light
          }`}
        ></div>
      </div>
      <div className={styles.color_text}>
        {isDarkMode && "Dark mode"}
        {!isDarkMode && "Light mode"}
      </div>
    </div>
  );
};

export default Colors;
