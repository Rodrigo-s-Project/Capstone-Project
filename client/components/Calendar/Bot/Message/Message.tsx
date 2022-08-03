import styles from "./Message.module.scss";
import { MESSAGE } from "../../../Messages/messages.types";
import { GlobalContext } from "../../../../pages/_app";
import { useContext } from "react";
import { getImage } from "../../../../routes/cdn.routes";

// Icons
import CameraIcon from "../../../Svgs/Camera";

import UsersReadComponent, {
  USER_READ
} from "../../../Reading/Users/UsersRead";

type Props = {
  message: MESSAGE;
};

const Message = ({ message }: Props) => {
  const { user } = useContext(GlobalContext);

  if (message.message.text.trim() == "") return null;

  const getImageMsg = () => {
    if (user && user.id == message.message.ownerId) {
      if (!user.profilePictureURL) return null;
      return getImage.url(user.profilePictureURL);
    }
    return "/bot.png";
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.chat} ${
          user && user.id == message.message.ownerId
            ? styles.chat_owner
            : styles.chat_foreign
        }`}
      >
        <div className={styles.chat_text}>
          <div className={styles.chat_text_msg}>{message.message.text}</div>
        </div>
      </div>
      <div
        className={`${styles.user} ${user &&
          user.id == message.message.ownerId &&
          styles.user_reverse}`}
      >
        <div className={styles.user_profile}>
          <div className={styles.user_profile_camera}>
            <CameraIcon />
          </div>
          {getImageMsg() && <img src={`${getImageMsg()}`} alt="" />}
        </div>
        <div className={styles.user_name}>
          {user && user.id == message.message.ownerId ? "You" : "BOT"}
        </div>
      </div>
    </div>
  );
};

export default Message;
