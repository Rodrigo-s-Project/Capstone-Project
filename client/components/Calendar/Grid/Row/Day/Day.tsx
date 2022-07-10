import styles from "./Day.module.scss";
import { DateCalendar } from "../../Grid";
import { useContext, useCallback } from "react";

import { CalendarContext } from "../../../Calendar";
import { GlobalContext } from "../../../../../pages/_app";

type Props = {
  day: DateCalendar;
  isToday: boolean;
};

const Day = ({ day, isToday }: Props) => {
  const { currDay, month, year, calendarView } = useContext(CalendarContext);
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
      ) && styles.day_anotherMonth} ${calendarView == "Day" && styles.day_day}`}
      onClick={createTask}
    >
      <div className={styles.day_number}>{day.day}</div>
    </div>
  );
};

export default Day;
