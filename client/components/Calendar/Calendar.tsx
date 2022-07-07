import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.calendar}>
      <div>{selectedTeam && selectedTeam.name} calendar</div>
    </div>
  );
};
export default Calendar;
