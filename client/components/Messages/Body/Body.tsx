import styles from "./Body.module.scss";
import { useContext, useEffect, Fragment, useRef, useState } from "react";
import { ChatContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";

import ChatIconRest from "../../Svgs/ChatRest";
import Loader from "../../Loader/Spinner/Spinner";

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

  const msgsContainer = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      socketRef &&
      socketRef.current &&
      ticketRef &&
      ticketRef.current &&
      selectedConnection &&
      setArrayMessages
    ) {
      setIsLoading(true);
      socketRef.current.emit(
        emitGetMessages.method,
        ...emitGetMessages.body(selectedConnection.connection.id)
      );
      socketRef.current.on(
        ontGetMessages,
        (dataOntGetMessages: DATA_GET_MESSAGES) => {
          setArrayMessages(dataOntGetMessages.messages);
          setIsLoading(false);
        }
      );
    }
  }, [socketRef, ticketRef, selectedConnection, setArrayMessages]);

  const lowerScroll = () => {
    if (msgsContainer && msgsContainer.current != null) {
      msgsContainer.current.scroll({
        top: 10_000_000,
        left: 0,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    lowerScroll();
  }, [arrayMessages]);

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
            <div>
              {selectedConnection.connection.name}
            </div>
          </div>
          <div ref={msgsContainer} className={styles.body_chat_messages}>
            {isLoading && (
              <div className={styles.loader}>
                <Loader color="lavender-300" />
              </div>
            )}
            {!isLoading && arrayMessages &&
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
