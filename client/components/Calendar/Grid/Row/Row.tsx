import styles from "./Row.module.scss";
import { DateCalendar } from "../Grid";
import { StretchCalendarRows } from "../../Calendar";

import DayComponent from "./Day/Day";
import { Fragment, useContext } from "react";
import { CalendarContext } from "../../Calendar";

import ChevronDown from "../../../Svgs/ChevronDown";

type PropsHeaderRow = {
  daysOfWeek: Array<string>;
  click: () => any;
  calendarStretchRow: StretchCalendarRows | undefined;
};

export const RowHeader = ({
  daysOfWeek,
  click,
  calendarStretchRow
}: PropsHeaderRow) => {
  const { calendarView } = useContext(CalendarContext);

  return (
    <div className={styles.row_header} onClick={click}>
      {calendarView == "Month" && (
        <div
          title={`${
            calendarStretchRow == "100px" ? "Shrink rows" : "Expand rows"
          }`}
          className={`${styles.row_header_svg} ${calendarStretchRow ==
            "100px" && styles.row_header_svg_rotate}`}
        >
          <ChevronDown />
        </div>
      )}

      {daysOfWeek &&
        daysOfWeek.map((date: string, index: number) => {
          return (
            <div className={styles.row_header_div} key={index}>
              {date}
            </div>
          );
        })}
    </div>
  );
};

type PropsRow = {
  datesRow: Array<DateCalendar>;
};

const Row = ({ datesRow }: PropsRow) => {
  const getToday = (date: Date): boolean => {
    const today = new Date();

    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };

  return (
    <div className={styles.row}>
      {datesRow &&
        datesRow.map((date: DateCalendar, index: number) => {
          return (
            <Fragment key={index}>
              <DayComponent isToday={getToday(date.date)} day={date} />
            </Fragment>
          );
        })}
    </div>
  );
};

export default Row;
