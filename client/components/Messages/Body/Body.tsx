import styles from "./Body.module.scss";
import { useContext } from "react";
import { ChatContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";

import ChatIconRest from "../../Svgs/ChatRest";

// Components
import Bar from "./Bar/Bar";

const BodyChats = () => {
  const { selectedConnection } = useContext(ChatContext);
  const { setArrayMsgs } = useContext(GlobalContext);

  const reloadMsgs = () => {
    if (setArrayMsgs) {
      setArrayMsgs(prev => [
        {
          text: "Feature not available...",
          type: "info"
        },
        ...prev
      ]);
    }
  };

  return (
    <div className={styles.body}>
      {!selectedConnection && (
        <div className={styles.body_select}>
          <ChatIconRest />
          <div>Select a group to see your chats!</div>
        </div>
      )}
      {selectedConnection && (
        <div className={styles.body_chat}>
          <div className={styles.body_chat_top}>
            <div onClick={reloadMsgs} title="Reload messages">
              {selectedConnection.connection.name}
            </div>
          </div>
          <div className={styles.body_chat_messages}></div>
          <Bar />
        </div>
      )}
    </div>
  );
};

export default BodyChats;
