import styles from "./NavBar.module.scss";
import { useContext } from "react";
import { DriveContext } from "../Provider";
import { FOLDER_TIMELINE } from "../drive.types";
import ChevronRightIcon from "../../Svgs/ChevronRight";

const NoBucket = () => {
  return (
    <div className={styles.nav_no_bucket}>Select a workspace to start</div>
  );
};

const TimeLine = () => {
  const { arrayFoldersTimeLine, selectedBucket } = useContext(DriveContext);

  return (
    <div className={styles.nav_timeline}>
      <div className={styles.nav_timeline_bucket}>
        {selectedBucket && selectedBucket.name}
      </div>
      {arrayFoldersTimeLine &&
        arrayFoldersTimeLine.map((folder: FOLDER_TIMELINE, index: number) => {
          return (
            <>
              <div className={styles.nav_timeline_folder_svg}>
                <ChevronRightIcon />
              </div>
              <div className={styles.nav_timeline_folder} key={index}>
                Name
              </div>
            </>
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
