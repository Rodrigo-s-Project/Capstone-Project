import styles from "./Grid.module.scss";
import { useContext, Fragment, useState, useEffect } from "react";

import { CalendarContext } from "../Calendar";
import RowElement, { RowHeader } from "./Row/Row";

// Hooks
import { useDates, DateCalendar } from "../../../hooks/useDates";

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
            setCalendarStretchRow(prev => (prev == "20vh" ? "1fr" : "20vh"));
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
