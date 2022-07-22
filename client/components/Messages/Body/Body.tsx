import styles from "./Body.module.scss";
import { useContext, useEffect, Fragment } from "react";
import { ChatContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";

import ChatIconRest from "../../Svgs/ChatRest";

// Components
import Bar from "./Bar/Bar";
import Message from "./Message/Message";

// Routes
import {
  ontGetMessages,
  DATA_GET_MESSAGES,
  emitGetMessages
} from "../../../routes/chat.routes";
import { MESSAGE } from "../messages.types";

const BodyChats = () => {
  const {
    selectedConnection,
    socketRef,
    ticketRef,
    setArrayMessages,
    arrayMessages
  } = useContext(ChatContext);
  const { setArrayMsgs } = useContext(GlobalContext);

  useEffect(() => {
    if (
      socketRef &&
      socketRef.current &&
      ticketRef &&
      ticketRef.current &&
      selectedConnection &&
      setArrayMessages
    ) {
      socketRef.current.emit(
        emitGetMessages.method,
        ...emitGetMessages.body(selectedConnection.connection.id)
      );
      socketRef.current.on(
        ontGetMessages,
        (dataOntGetMessages: DATA_GET_MESSAGES) => {
          setArrayMessages(dataOntGetMessages.messages);
        }
      );
    }
  }, [socketRef, ticketRef, selectedConnection, setArrayMessages]);

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
          <div className={styles.body_chat_messages}>
            {arrayMessages &&
              arrayMessages.map((messageRef: MESSAGE, index: number) => {
                return (
                  <Fragment key={index}>
                    <Message message={messageRef} />
                  </Fragment>
                );
              })}
          </div>
          <Bar />
        </div>
      )}
    </div>
  );
};

export default BodyChats;
