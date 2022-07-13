import styles from "./NavBar.module.scss";
import { useContext } from "react";
import { DriveContext } from "../Drive";

const NoBucket = () => {
  return (
    <div className={styles.nav_no_bucket}>
      Select a workspace to start
    </div>
  );
};

const NavBarDrive = () => {
  const { selectedBucket } = useContext(DriveContext);
  return <div className={styles.nav}>{!selectedBucket && <NoBucket />}</div>;
};

export default NavBarDrive;
