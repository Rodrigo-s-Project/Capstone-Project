import styles from "./Row.module.scss";
import { DateCalendar } from "../../../../hooks/useDates";

import DayComponent from "./Day/Day";
import { Fragment, useContext, Dispatch, SetStateAction } from "react";
import { CalendarContext, StretchCalendarRows } from "../../Provider";

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
  const { calendarView, currDay, year, month } = useContext(CalendarContext);

  return (
    <>
      {calendarView == "Day" && currDay && year && month && (
        <div className={styles.row_header}>
          <div
            className={`${styles.row_header_div} ${styles.row_header_div_all}`}
          >
            {daysOfWeek[new Date(year, month, currDay).getDay()]}
          </div>
        </div>
      )}
      {calendarView != "Day" && (
        <div className={styles.row_header}>
          {calendarView == "Month" && (
            <div
              onClick={click}
              title={`${
                calendarStretchRow == "20vh" ? "Shrink rows" : "Expand rows"
              }`}
              className={`${styles.row_header_svg} ${calendarStretchRow ==
                "20vh" && styles.row_header_svg_rotate}`}
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
      )}
    </>
  );
};

type PropsRow = {
  datesRow: Array<DateCalendar>;
  matrixDates: Array<Array<DateCalendar>>;
  setMatrixDates: Dispatch<SetStateAction<Array<Array<DateCalendar>>>>;
};

const matrixStarter = {
  date: new Date(),
  weekday: "",
  day: 0,
  tasks: undefined,
  isOnHover: false,
  isResizing: false,
  dontShow: true
};

const Row = ({ datesRow, matrixDates, setMatrixDates }: PropsRow) => {
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
              <DayComponent
                matrixDates={matrixDates}
                setMatrixDates={setMatrixDates}
                isToday={getToday(date.date)}
                day={date}
              />
            </Fragment>
          );
        })}
      {!datesRow &&
        Array(7)
          .fill(matrixStarter)
          .map((date: DateCalendar, index: number) => {
            return (
              <Fragment key={index}>
                <DayComponent
                  matrixDates={matrixDates}
                  setMatrixDates={setMatrixDates}
                  isToday={getToday(date.date)}
                  day={date}
                />
              </Fragment>
            );
          })}
    </div>
  );
};

export default Row;
