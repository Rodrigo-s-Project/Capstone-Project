import { useContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

// Components
import TopCalendar from "./Top/Top";
import GridCalendar from "./Grid/Grid";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.calendar}>
      <h1>{selectedTeam && selectedTeam.name}&apos;s Calendar</h1>
      <div className={styles.calendar_container}>
        <TopCalendar />
        <GridCalendar />
      </div>
    </div>
  );
};
export default Calendar;
