import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
// import { DriveContext } from "./Provider";
import styles from "./Drive.module.scss";

// Components
import NavBarDrive from "./NavBar/NavBar";
import AsideDrive from "./Aside/Aside";
import BodyDrive from "./Body/Body";

// TODO: issue between companies having same workspace

const Drive = () => {
  const { selectedTeam } = useContext(GlobalContext);
  // const {  } = useContext(DriveContext);

  return (
    <div className={styles.drive}>
      <h1>{selectedTeam && selectedTeam.name}&apos;s Workspace</h1>
      <div className={styles.drive_wrapper}>
        <div className={styles.drive_container}>
          <NavBarDrive />
          <BodyDrive />
        </div>
        <div className={styles.drive_aside}>
          <AsideDrive />
        </div>
      </div>
    </div>
  );
};
export default Drive;
