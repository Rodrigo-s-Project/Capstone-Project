import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from "react";
import { DateCalendar } from "../../hooks/useDates";
import { DATA_GET_USER } from "../../routes/main.routes";

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

  idTask: number;
  setIdTask: Dispatch<SetStateAction<number>>;
  isSingleDateTask: boolean;
  setIsSingleDateTask: Dispatch<SetStateAction<boolean>>;
  fromTask: number;
  setFromTask: Dispatch<SetStateAction<number>>;
  toTask: number;
  setToTask: Dispatch<SetStateAction<number>>;
  nameTask: string;
  setNameTask: Dispatch<SetStateAction<string>>;
  descriptionTask: string;
  setDescriptionTask: Dispatch<SetStateAction<string>>;
  usersTask: Array<string>;
  setUsersTask: Dispatch<SetStateAction<Array<string>>>;
  tagsTask: Array<string>;
  setTagsTask: Dispatch<SetStateAction<Array<string>>>;
  allUsersCalendar: Array<DATA_GET_USER>;
  setAllUsersCalendar: Dispatch<SetStateAction<Array<DATA_GET_USER>>>;
  allTagsCalendar: Array<any>;
  setAllTagsCalendar: Dispatch<SetStateAction<Array<any>>>;

  isLoadingTask: boolean;
  setIsLoadingTask: Dispatch<SetStateAction<boolean>>;
  isTaskModalOnEditing: boolean;
  setIsTaskModalOnEditing: Dispatch<SetStateAction<boolean>>;

  dayClick: DateCalendar | undefined;
  setDayClick: Dispatch<SetStateAction<DateCalendar | undefined>>;

  refetchTasks: boolean;
  setRefetchTasks: Dispatch<SetStateAction<boolean>>;
}

const Calendar = ({ children }: { children: any }) => {
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

  // Tasks modal state
  const [idTask, setIdTask] = useState<number>(0);
  const [isSingleDateTask, setIsSingleDateTask] = useState<boolean>(false);
  const [fromTask, setFromTask] = useState<number>(0);
  const [toTask, setToTask] = useState<number>(0);
  const [nameTask, setNameTask] = useState<string>("");
  const [descriptionTask, setDescriptionTask] = useState<string>("");
  const [usersTask, setUsersTask] = useState<Array<string>>([]);
  const [tagsTask, setTagsTask] = useState<Array<string>>([]);
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);
  const [isTaskModalOnEditing, setIsTaskModalOnEditing] = useState<boolean>(
    false
  );

  const [allUsersCalendar, setAllUsersCalendar] = useState<
    Array<DATA_GET_USER>
  >([]);
  const [allTagsCalendar, setAllTagsCalendar] = useState<Array<any>>([]);

  // Create tasks
  const [dayClick, setDayClick] = useState<DateCalendar | undefined>(undefined);
  const [refetchTasks, setRefetchTasks] = useState<boolean>(false);

  useEffect(() => {
    changeCalendarForPhone();
    window.addEventListener("resize", changeCalendarForPhone);

    return () => {
      window.removeEventListener("resize", changeCalendarForPhone);
    };
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
        setIsResizingFromRight,
        idTask,
        setIdTask,
        isSingleDateTask,
        setIsSingleDateTask,
        fromTask,
        setFromTask,
        toTask,
        setToTask,
        nameTask,
        setNameTask,
        descriptionTask,
        setDescriptionTask,
        usersTask,
        setUsersTask,
        tagsTask,
        setTagsTask,
        isLoadingTask,
        setIsLoadingTask,
        isTaskModalOnEditing,
        setIsTaskModalOnEditing,
        allUsersCalendar,
        setAllUsersCalendar,
        allTagsCalendar,
        setAllTagsCalendar,
        dayClick,
        setDayClick,
        refetchTasks,
        setRefetchTasks
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
export default Calendar;
