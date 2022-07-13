import styles from "./Body.module.scss";
import BodySvg from "../../Svgs/DriveNotFound";
import { useContext } from "react";
import { DriveContext } from "../Drive";

import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants } from "../../../animations/fade";
import Loader from "../../Loader/Spinner/Spinner";

const NotBucket = () => {
  return (
    <div className={styles.body_not_files}>
      <BodySvg />
      <div>Select a workspace to see your documents!</div>
    </div>
  );
};

const NotDocuments = () => {
  return (
    <div className={styles.body_not_files}>
      <BodySvg />
      <div>You don&apos;t have any files in this workspace!</div>
    </div>
  );
};

const BodyDrive = () => {
  const { isLoadingBody, selectedBucket, arrayDocuments } = useContext(
    DriveContext
  );

  return (
    <div className={styles.body}>
      <AnimatePresence exitBeforeEnter>
        {isLoadingBody ? (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="loader-body-drive"
            className={styles.body_loader}
          >
            <Loader additionalClass="loader-drive-body" color="lavender-300" />
          </motion.div>
        ) : (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.body_wrapper}
          >
            {!selectedBucket && <NotBucket />}
            {selectedBucket && arrayDocuments && arrayDocuments.length == 0 && (
              <NotDocuments />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyDrive;
