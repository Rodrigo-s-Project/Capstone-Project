import styles from "./Bar.module.scss";
import { ChatContext } from "../../Provider";
import { useContext, useState } from "react";

import { emitCreateMessage } from "../../../../routes/chat.routes";

const Bar = () => {
  const { socketRef, ticketRef, selectedConnection } = useContext(ChatContext);

  const [text, setText] = useState<any>("");
  const [mediaURL, setMediaURL] = useState<any>(undefined);
  const [lat, setLat] = useState<any>(undefined);
  const [lng, setLng] = useState<any>(undefined);

  const sendMsg = () => {
    if (
      socketRef &&
      socketRef.current &&
      ticketRef &&
      ticketRef.current &&
      selectedConnection
    ) {
      if (
        (text && text.trim() != "") ||
        (mediaURL && mediaURL.trim() != "") ||
        (!isNaN(lat) && !isNaN(lng))
      ) {
        // At least one passes
        socketRef.current.emit(
          emitCreateMessage.method,
          ...emitCreateMessage.body(
            selectedConnection.connection.id,
            text,
            mediaURL,
            lat,
            lng
          )
        );

        setText("");
        setMediaURL(undefined);
        setLat(undefined);
        setLng(undefined);
      }
    }
  };

  return (
    <div className={styles.bar}>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <input
          placeholder="Write a message here"
          type="text"
          name="chat"
          id="main-chat-input"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button onClick={sendMsg}>Send</button>
      </form>
    </div>
  );
};
export default Bar;
