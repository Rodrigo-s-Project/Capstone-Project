import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Drive.module.scss";

const Drive = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.drive}>
      <div>{selectedTeam && selectedTeam.name} drive</div>
    </div>
  );
};
export default Drive;
