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

export type StretchCalendarRows = "1fr" | "100px";
export type CalendarViews = "Month" | "Week" | "Day";

interface CalendarAppProvide {
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  currDay: number;
  setCurrDay: Dispatch<SetStateAction<number>>;
  calendarStretchRow: StretchCalendarRows;
  setCalendarStretchRow: Dispatch<SetStateAction<StretchCalendarRows>>;
  calendarView: CalendarViews;
  setCalendarView: Dispatch<SetStateAction<CalendarViews>>;
}

// Components
import TopCalendar from "./Top/Top";
import GridCalendar from "./Grid/Grid";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);

  // State
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [currDay, setCurrDay] = useState<number>(new Date().getDate());

  const [calendarStretchRow, setCalendarStretchRow] = useState<
    StretchCalendarRows
  >("1fr");

  const [calendarView, setCalendarView] = useState<CalendarViews>("Month");

  return (
    <CalendarContext.Provider
      value={{
        month,
        setMonth,
        year,
        setYear,
        calendarStretchRow,
        setCalendarStretchRow,
        calendarView,
        setCalendarView,
        currDay,
        setCurrDay
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
