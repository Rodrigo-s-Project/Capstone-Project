import styles from "./Body.module.scss";
import BodySvg from "../../Svgs/DriveNotFound";
import { useContext, useState } from "react";
import { DriveContext } from "../Provider";

import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants, fadeVariantsDelayExit } from "../../../animations/fade";
import { ownStaggerVariants } from "../../../animations/stagger";
import Loader from "../../Loader/Spinner/Spinner";
import PlusIcon from "../../Svgs/Plus";
import FileIcon from "../../Svgs/File";
import FolderOpenIcon from "../../Svgs/FolderOpen";

import GridBody from "./Grid/Grid";

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

const AddDocumentsBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setModalPopUpAddFolder, setModalPopUpAddFiles } = useContext(
    DriveContext
  );

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const addFolder = () => {
    if (setModalPopUpAddFolder) setModalPopUpAddFolder(true);
  };

  const addFiles = () => {
    if (setModalPopUpAddFiles) setModalPopUpAddFiles(true);
  };

  return (
    <>
      <div
        onBlur={close}
        tabIndex={-1}
        onClick={open}
        title="Add document"
        className={styles.body_add}
      >
        <PlusIcon />
      </div>
      <AnimatePresence exitBeforeEnter>
        {isOpen ? (
          <motion.div
            variants={ownStaggerVariants(0)}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="btn-add-folder"
            className={`${styles.body_add_folder} ${styles.body_add}`}
            onClick={addFolder}
          >
            <FolderOpenIcon />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        {isOpen ? (
          <motion.div
            variants={ownStaggerVariants(0.1)}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="btn-add-file"
            className={`${styles.body_add_file} ${styles.body_add}`}
            onClick={addFiles}
          >
            <FileIcon />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

const BodyDrive = () => {
  const { isLoadingBody, arrayDocuments, selectedBucket } = useContext(
    DriveContext
  );
  return (
    <div className={styles.body}>
      <AnimatePresence exitBeforeEnter>
        {isLoadingBody ? (
          <motion.div
            variants={fadeVariantsDelayExit}
            initial="hidden"
            animate="visible"
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
            className={styles.body_wrapper}
          >
            {!selectedBucket && <NotBucket />}
            {selectedBucket &&
              arrayDocuments &&
              arrayDocuments.folders &&
              arrayDocuments.files &&
              arrayDocuments.files.length + arrayDocuments.folders.length ==
                0 && <NotDocuments />}
            {selectedBucket &&
              arrayDocuments &&
              arrayDocuments.folders &&
              arrayDocuments.files &&
              arrayDocuments.files.length + arrayDocuments.folders.length >
                0 && <GridBody />}
            {selectedBucket && <AddDocumentsBtn />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyDrive;
