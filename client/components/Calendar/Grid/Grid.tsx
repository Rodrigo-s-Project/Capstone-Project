import styles from "./Grid.module.scss";
import { useContext } from "react";

import { CalendarContext } from "../Calendar";

export type DateCalendar = {
  date: Date;
  weekday: string;
  day: number;
};

const Grid = () => {
  // Context
  const { month, year } = useContext(CalendarContext);

  const getDaysInMonth = (_month: any, _year: any): Array<DateCalendar> => {
    // Vars undefined
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) {
      return [];
    }

    let date: Date = new Date(_year, _month, 1);
    let days: Array<DateCalendar> = [];
    while (date.getMonth() === _month) {
      let thisDate: Date = new Date(date);
      days.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" }))
      });
      date.setDate(date.getDate() + 1);
    }
    console.log(days);
    return days;
  };

  return (
    <div className={styles.grid}>
      <div>
        {getDaysInMonth(month, year).map(
          (item: DateCalendar, index: number) => {
            return (
              <div key={index}>
                {item.weekday} - {item.day}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
export default Grid;
