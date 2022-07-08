import { useContext, createContext } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

export const CalendarContex = createContext<Partial<CalendarAppProvide>>({});

interface CalendarAppProvide {}

// Components
import TopCalendar from "./Top/Top";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <CalendarContex.Provider value={{}}>
      <div className={styles.calendar}>
        <h1>{selectedTeam && selectedTeam.name}'s Calendar</h1>
        <div className={styles.calendar_container}>
          <TopCalendar />
        </div>
      </div>
    </CalendarContex.Provider>
  );
};
export default Calendar;
