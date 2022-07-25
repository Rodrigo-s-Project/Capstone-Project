import styles from "./Bar.module.scss";
import { ChatContext } from "../../Provider";
import { useContext, useState } from "react";

import { emitCreateMessage } from "../../../../routes/chat.routes";

// Icons
import PaperPlaneIcon from "../../../Svgs/PaperPlane";
import KeyboardIcon from "../../../Svgs/Keyboard";

const Bar = () => {
  const { socketRef, ticketRef, selectedConnection } = useContext(ChatContext);

  const [text, setText] = useState<any>("");
  const [mediaURL, setMediaURL] = useState<any>(undefined);
  const [lat, setLat] = useState<any>(undefined);
  const [lng, setLng] = useState<any>(undefined);

  const canSend = (): boolean => {
    return (
      (text && text.trim() != "") ||
      (mediaURL && mediaURL.trim() != "") ||
      (!isNaN(lat) && !isNaN(lng))
    );
  };

  const sendMsg = () => {
    if (
      socketRef &&
      socketRef.current &&
      ticketRef &&
      ticketRef.current &&
      selectedConnection
    ) {
      if (canSend()) {
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
        <button
          title="Send message"
          style={{
            cursor: canSend() ? "pointer" : "not-allowed"
          }}
          onClick={sendMsg}
        >
          {canSend() ? <PaperPlaneIcon /> : <KeyboardIcon />}
        </button>
      </form>
    </div>
  );
};
export default Bar;
