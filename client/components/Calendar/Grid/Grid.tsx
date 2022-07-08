import styles from "./Grid.module.scss";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";

import { CalendarContext } from "../Calendar";
import RowElement, { RowHeader } from "./Row/Row";

// Hooks
import { useDates } from "../../../hooks/useDates";

export type DateCalendar = {
  date: Date;
  weekday: string;
  day: number;
};

const Grid = () => {
  // Context
  const {
    month,
    year,
    calendarStretchRow,
    setCalendarStretchRow,
    calendarView
  } = useContext(CalendarContext);
  const [matrixDates, setMatrixDates] = useState<Array<Array<DateCalendar>>>(
    []
  );

  // Hook
  const { createMatrix, getNumberOfRows } = useDates();

  useEffect(() => {
    const matrix = createMatrix();
    setMatrixDates(matrix);
  }, [setMatrixDates, month, year, createMatrix]);

  return (
    <div
      style={{
        gridTemplateRows: `30px repeat(${getNumberOfRows()}, ${
          calendarView == "Month" ? calendarStretchRow : "1fr"
        })`
      }}
      className={styles.grid}
    >
      <RowHeader
        click={() => {
          if (setCalendarStretchRow)
            setCalendarStretchRow(prev => (prev == "100px" ? "1fr" : "100px"));
        }}
        calendarStretchRow={calendarStretchRow}
        daysOfWeek={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      />
      {[...Array(getNumberOfRows())].map((_: any, index: number) => {
        return (
          <Fragment key={index}>
            <RowElement datesRow={matrixDates[index]} />
          </Fragment>
        );
      })}
    </div>
  );
};
export default Grid;