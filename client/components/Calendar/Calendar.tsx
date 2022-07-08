import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction
} from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

export const CalendarContext = createContext<Partial<CalendarAppProvide>>({});

interface CalendarAppProvide {
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
}

// Components
import TopCalendar from "./Top/Top";
import GridCalendar from "./Grid/Grid";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);

  // State
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <CalendarContext.Provider
      value={{
        month,
        setMonth,
        year,
        setYear
      }}
    >
      <div className={styles.calendar}>
        <h1>{selectedTeam && selectedTeam.name}&apos;s Calendar</h1>
        <div className={styles.calendar_container}>
          <TopCalendar />
          <GridCalendar />
        </div>
      </div>
    </CalendarContext.Provider>
  );
};
export default Calendar;
