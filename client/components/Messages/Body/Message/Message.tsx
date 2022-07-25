import styles from "./Message.module.scss";
import { MESSAGE } from "../../messages.types";
import { GlobalContext } from "../../../../pages/_app";
import { ChatContext } from "../../Provider";
import { useContext } from "react";

type Props = {
  message: MESSAGE;
};

const Message = ({ message }: Props) => {
  const { user } = useContext(GlobalContext);
  const { selectedConnection } = useContext(ChatContext);

  if (message.text.trim() == "") return null;

  const getOwner = (): string => {
    if (selectedConnection) {
      for (let i = 0; i < selectedConnection.users.length; i++) {
        if (selectedConnection.users[i].user.id == message.ownerId) {
          return selectedConnection.users[i].team.User_Team.username;
        }
      }
      return "";
    }
    return "";
  };

  return (
    <div
      className={`${styles.chat} ${
        user && user.id == message.ownerId
          ? styles.chat_owner
          : styles.chat_foreign
      }`}
    >
      {user && user.id != message.ownerId && <div className={styles.chat_name}>{getOwner()}</div>}
      <div>{message.text}</div>
    </div>
  );
};

export default Message;
