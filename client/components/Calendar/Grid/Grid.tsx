import styles from "./Grid.module.scss";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";

import { CalendarContext } from "../Calendar";
import RowElement from "./Row/Row";

export type DateCalendar = {
  date: Date;
  weekday: string;
  day: number;
};

const Grid = () => {
  // Context
  const { month, year } = useContext(CalendarContext);
  const [matrixDates, setMatrixDates] = useState<Array<Array<DateCalendar>>>(
    []
  );

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
    return days;
  };

  const getNumberOfRows = useCallback((): number => {
    const dates: Array<DateCalendar> = getDaysInMonth(month, year);
    let numberOfSundays = 0;
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].weekday == "Sunday") {
        numberOfSundays += 1;
      }
    }
    if (dates[0].weekday != "Sunday") {
      numberOfSundays += 1;
    }

    return numberOfSundays;
  }, [month, year]);

  const createMatrix = useCallback((): Array<Array<DateCalendar>> => {
    let matrix: Array<Array<DateCalendar>> = [];
    const numberOfRows: number = getNumberOfRows();
    const dates: Array<DateCalendar> = getDaysInMonth(month, year);

    const auxMonth: any = month;
    const auxYear: any = year;

    if (!Number.isFinite(auxMonth) || !Number.isFinite(auxYear)) {
      return [];
    }

    // Build rows
    // FIRST ROW
    const prevMonth: number = auxMonth == 0 ? 11 : auxMonth - 1;
    const prevYear: number = auxMonth == 0 ? auxYear - 1 : auxYear;
    const prevDates: Array<DateCalendar> = getDaysInMonth(prevMonth, prevYear);

    // dates[0].date.getDay() -> is the number of complementary dates it needs
    const complementaryPrevDates: Array<DateCalendar> = prevDates.slice(
      prevDates.length - dates[0].date.getDay(),
      prevDates.length
    );

    // I need 7 - complementaryDates.length more dates to add up to 7 in a week
    matrix.push([
      ...complementaryPrevDates,
      ...dates.slice(0, 7 - complementaryPrevDates.length)
    ]);

    let index: number = 7 - complementaryPrevDates.length;

    // Substract 2, so first and last row not count in loop
    for (let i = 0; i < numberOfRows - 2; i++) {
      matrix.push([...dates.slice(index, index + 7)]);
      index += 7;
    }

    // LAST ROW
    const nextMonth: number = auxMonth == 11 ? 0 : auxMonth + 1;
    const nextYear: number = auxMonth == 11 ? auxYear + 1 : auxYear;
    const nextDates: Array<DateCalendar> = getDaysInMonth(nextMonth, nextYear);

    // 6 - dates[dates.length - 1].date.getDay() -> is the number of complementary dates it needs
    const complementaryNextDates: Array<DateCalendar> = nextDates.slice(
      0,
      6 - dates[dates.length - 1].date.getDay()
    );

    matrix.push([
      ...dates.slice(index, dates.length),
      ...complementaryNextDates
    ]);

    return matrix;
  }, [month, year, getNumberOfRows]);

  useEffect(() => {
    const matrix = createMatrix();
    setMatrixDates(matrix);
  }, [setMatrixDates, month, year, createMatrix]);

  return (
    <div
      style={{
        gridTemplateRows: `repeat(${getNumberOfRows()}, 1fr)`
      }}
      className={styles.grid}
    >
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
