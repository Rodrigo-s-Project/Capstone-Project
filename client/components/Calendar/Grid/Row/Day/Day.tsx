import styles from "./Day.module.scss";
import { DateCalendar } from "../../../../../hooks/useDates";
import {
  useContext,
  useCallback,
  Fragment,
  Dispatch,
  SetStateAction
} from "react";

import { CalendarContext } from "../../../Calendar";
import { GlobalContext } from "../../../../../pages/_app";

import { TaskType } from "../../../../../routes/calendar.routes";
import Task from "./Task/Task";

// Icons
import PlusIcon from "../../../../Svgs/Plus";

type Props = {
  day: DateCalendar;
  isToday: boolean;
  matrixDates: Array<Array<DateCalendar>>;
  setMatrixDates: Dispatch<SetStateAction<Array<Array<DateCalendar>>>>;
};

const Day = ({ day, isToday, matrixDates, setMatrixDates }: Props) => {
  const { currDay, month, year, calendarView, isCalendarLoading } = useContext(
    CalendarContext
  );
  const { setModalPopUpCreateTask, setDayClick } = useContext(GlobalContext);

  const isAnotherMonth = useCallback(
    (day: Date): boolean => {
      const _year: any = year;
      const _month: any = month;
      const _currDay: any = currDay;
      if (
        !Number.isFinite(_year) ||
        !Number.isFinite(_month) ||
        !Number.isFinite(_currDay)
      )
        return false;

      const thisDate: Date = new Date(day);
      const currDate: Date = new Date(_year, _month, currDay);

      return thisDate.getMonth() != currDate.getMonth();
    },
    [currDay, month, year]
  );

  const createTask = () => {
    if (setModalPopUpCreateTask && setDayClick) {
      setDayClick(day);
      setModalPopUpCreateTask(true);
    }
  };

  return (
    <div
      className={`${styles.day} ${isToday && styles.day_today} ${isAnotherMonth(
        day.date
      ) && styles.day_anotherMonth} ${calendarView == "Day" &&
        styles.day_day} ${(isCalendarLoading || day.dontShow) &&
        styles.loader}`}
    >
      {!day.dontShow && (
        <>
          <div className={styles.day_number}>{day.day}</div>
          <div className={styles.day_plus} onClick={createTask}>
            <PlusIcon />
          </div>
          <div className={styles.tasks}>
            {day.tasks &&
              day.tasks.length > 0 &&
              day.tasks.map((task: TaskType, index: number) => {
                return (
                  <Fragment key={index}>
                    <Task
                      matrixDates={matrixDates}
                      setMatrixDates={setMatrixDates}
                      task={task}
                      day={day}
                    />
                  </Fragment>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Day;
