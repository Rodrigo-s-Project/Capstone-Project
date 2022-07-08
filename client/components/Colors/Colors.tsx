import styles from "./Colors.module.scss";
import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import { useColorTheme } from "../../hooks/useColorTheme";
import axios from "axios";
import { BODY_UPDATE_COLOR, updateUserColor } from "../../routes/main.routes";
import { RESPONSE } from "../../routes/index.routes";

type Props = {
  callback?: () => any;
};

const Colors = ({ callback }: Props) => {
  const { isDarkMode, setArrayMsgs } = useContext(GlobalContext);
  const { handleColorChange } = useColorTheme();

  const fetchUserColor = async (newMode: boolean) => {
    try {
      const body: BODY_UPDATE_COLOR = {
        isDarkModeOn: newMode
      };

      const response = await axios.put(updateUserColor.url, body, {
        withCredentials: true
      });

      const data: RESPONSE = response.data;
      if (data.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  return (
    <div
      className={styles.color}
      onClick={() => {
        if (callback) callback();
        fetchUserColor(!isDarkMode);
        handleColorChange();
      }}
      title="Toggle mode"
    >
      <div className={styles.color_pill}>
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
