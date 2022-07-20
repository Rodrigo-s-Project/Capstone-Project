import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Messages.module.scss";

// Componnets
import Chats from "./Chats/Chats";
import BodyChats from "./Body/Body";

const Messages = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.messages}>
      <h1>{selectedTeam && selectedTeam.name}&apos;s messages</h1>
      <div className={styles.messages_wrapper}>
        <div className={styles.messages_aside}>
          <Chats />
        </div>
        <div className={styles.messages_container}>
          <BodyChats />
        </div>
      </div>
    </div>
  );
};
export default Messages;
