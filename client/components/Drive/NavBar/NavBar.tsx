import styles from "./NavBar.module.scss";
import { useContext, Fragment } from "react";
import { DriveContext } from "../Provider";
import ChevronRightIcon from "../../Svgs/ChevronRight";
import { DOCUMENT_DATA } from "../../../routes/drive.routes";

const NoBucket = () => {
  return (
    <div className={styles.nav_no_bucket}>Select a workspace to start</div>
  );
};

const TimeLine = () => {
  const {
    arrayFoldersTimeLine,
    selectedBucket,
    setSelectedBucket,
    setArrayFoldersTimeLine,
    fetchDocuments
  } = useContext(DriveContext);

  const clickLinkBucket = () => {
    if (
      setSelectedBucket &&
      setArrayFoldersTimeLine &&
      fetchDocuments &&
      selectedBucket
    ) {
      setArrayFoldersTimeLine([]);
      setSelectedBucket(selectedBucket);
      fetchDocuments({
        bucket: selectedBucket,
        arrayFoldersTimeLine: []
      });
    }
  };

  const clickLink = (index: number) => {
    if (
      setArrayFoldersTimeLine &&
      fetchDocuments &&
      selectedBucket &&
      arrayFoldersTimeLine
    ) {
      fetchDocuments({
        bucket: selectedBucket,
        arrayFoldersTimeLine: [...arrayFoldersTimeLine.slice(0, index + 1)]
      });
      setArrayFoldersTimeLine(prev => [...prev.slice(0, index + 1)]);
    }
  };

  return (
    <div className={styles.nav_timeline}>
      <div onClick={clickLinkBucket} className={styles.nav_timeline_bucket}>
        {selectedBucket && selectedBucket.name}
      </div>
      {arrayFoldersTimeLine &&
        arrayFoldersTimeLine.map((folder: DOCUMENT_DATA, index: number) => {
          return (
            <Fragment key={index}>
              <div className={styles.nav_timeline_folder_svg}>
                <ChevronRightIcon />
              </div>
              <div
                onClick={() => {
                  clickLink(index);
                }}
                className={styles.nav_timeline_folder}
                key={index}
              >
                {folder.name}
              </div>
            </Fragment>
          );
        })}
    </div>
  );
};

const NavBarDrive = () => {
  const { selectedBucket } = useContext(DriveContext);
  return (
    <div className={styles.nav}>
      {!selectedBucket && <NoBucket />}
      {selectedBucket && <TimeLine />}
    </div>
  );
};

export default NavBarDrive;
