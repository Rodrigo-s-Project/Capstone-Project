import styles from "./Message.module.scss";
import { MESSAGE } from "../../messages.types";
import { GlobalContext } from "../../../../pages/_app";
import { useContext } from "react";

type Props = {
  message: MESSAGE;
};

const Message = ({ message }: Props) => {
  const { user } = useContext(GlobalContext);

  if (message.text.trim() == "") return null;
  return (
    <div
      className={`${styles.chat} ${
        user && user.id == message.ownerId
          ? styles.chat_owner
          : styles.chat_foreign
      }`}
    >
      <div>{message.text}</div>
    </div>
  );
};

export default Message;
