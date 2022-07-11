import styles from "../Controls.module.scss";
import { GlobalContext } from "../../../pages/_app";
import { useContext } from "react";
import { AnimatePresence } from "framer-motion";

const TeamSettingsController = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <AnimatePresence>
      {!selectedTeam ? null : (
        <div className={styles.control}>
          <div className={styles.control_top}>
            <h1>{selectedTeam.name}</h1>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TeamSettingsController;
