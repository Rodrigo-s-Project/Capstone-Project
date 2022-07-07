import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Messages.module.scss";

const Messages = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.calendar}>
      <div>{selectedTeam && selectedTeam.name} messages</div>
    </div>
  );
};
export default Messages;
