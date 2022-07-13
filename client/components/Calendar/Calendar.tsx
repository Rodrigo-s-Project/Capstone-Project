import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

export const CalendarContext = createContext<Partial<CalendarAppProvide>>({});

export type StretchCalendarRows = "1fr" | "20vh";
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

  setIsCalendarLoading: Dispatch<SetStateAction<boolean>>;
  isCalendarLoading: boolean;

  isResizing: boolean;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  taskIdResizing: number;
  setTaskIdResizing: Dispatch<SetStateAction<number>>;
  fromTaskResizing: number;
  setFromTaskResizing: Dispatch<SetStateAction<number>>;
  toTaskResizing: number;
  setToTaskResizing: Dispatch<SetStateAction<number>>;
  isResizingFromRight: boolean;
  setIsResizingFromRight: Dispatch<SetStateAction<boolean>>;
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
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [taskIdResizing, setTaskIdResizing] = useState<number>(0);
  const [fromTaskResizing, setFromTaskResizing] = useState<number>(0);
  const [toTaskResizing, setToTaskResizing] = useState<number>(0);
  const [isResizingFromRight, setIsResizingFromRight] = useState<boolean>(true);

  useEffect(() => {
    changeCalendarForPhone();
    window.addEventListener("resize", changeCalendarForPhone);
  }, []);

  const changeCalendarForPhone = () => {
    if (window.innerWidth < 600) {
      setCalendarView("Day");
    }
  };

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
        setCurrDay,
        setIsCalendarLoading,
        isCalendarLoading,
        isResizing,
        setIsResizing,
        taskIdResizing,
        setTaskIdResizing,
        fromTaskResizing,
        setFromTaskResizing,
        toTaskResizing,
        setToTaskResizing,
        isResizingFromRight,
        setIsResizingFromRight
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
