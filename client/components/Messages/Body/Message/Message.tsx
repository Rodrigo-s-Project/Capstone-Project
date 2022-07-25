import styles from "./Message.module.scss";
import { MESSAGE } from "../../messages.types";
import { GlobalContext } from "../../../../pages/_app";
import { ChatContext } from "../../Provider";
import { useContext, CSSProperties } from "react";
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
  const { selectedConnection } = useContext(ChatContext);

  if (message.message.text.trim() == "") return null;

  const getOwner = (): any => {
    if (selectedConnection) {
      for (let i = 0; i < selectedConnection.users.length; i++) {
        if (selectedConnection.users[i].user.id == message.message.ownerId) {
          return selectedConnection.users[i];
        }
      }
      return undefined;
    }
    return undefined;
  };

  const getFormatUserRead = (): Array<USER_READ> => {
    let aux: Array<USER_READ> = [];

    for (let i = 0; i < message.users.length; i++) {
      aux.push({
        username: message.users[i].team.User_Team.username,
        userData: {
          email: message.users[i].user.email,
          globalUsername: message.users[i].user.globalUsername,
          id: message.users[i].user.id,
          isDarkModeOn: message.users[i].user.isDarkModeOn,
          profilePictureURL: message.users[i].user.profilePictureURL,
          status: message.users[i].user.status,
          User_Read_Files: {
            createdAt: message.users[i].createdAt || new Date()
          }
        }
      });
    }

    return aux;
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
          {message.message.mediaURL && (
            <div className={styles.chat_img}>
              <img
                src={`${getImage.url(message.message.mediaURL)}`}
                alt="Picture"
              />
            </div>
          )}
          <div></div>
          {message.message.text}
        </div>
        <div
          className={`${styles.chat_reading}`}
          style={
            {
              "--length-container":
                getFormatUserRead().length > 5 ? 5 : getFormatUserRead().length
            } as CSSProperties
          }
        >
          <UsersReadComponent usersRead={getFormatUserRead()} />
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
          {getOwner() && getOwner().user.profilePictureURL && (
            <img
              src={`${getImage.url(getOwner().user.profilePictureURL)}`}
              alt={getOwner().team.User_Team.username}
            />
          )}
        </div>
        <div className={styles.user_name}>
          {user && user.id == message.message.ownerId
            ? "You"
            : getOwner() && getOwner().team.User_Team.username}
        </div>
      </div>
    </div>
  );
};

export default Message;
