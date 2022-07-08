import { useCallback, useContext } from "react";

import { CalendarContext } from "../components/Calendar/Calendar";

export type DateCalendar = {
  date: Date;
  weekday: string;
  day: number;
};

export const useDates = () => {
  const { month, year, calendarView, currDay } = useContext(CalendarContext);

  // FETCHING
  const getDaysInMonth = (_month: any, _year: any): Array<DateCalendar> => {
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) return [];

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

  const getDaysInWeek = (
    _month: any,
    _year: any,
    _day: any
  ): Array<Array<DateCalendar>> => {
    if (
      !Number.isFinite(_year) ||
      !Number.isFinite(_month) ||
      !Number.isFinite(_day)
    )
      return [];

    let date: Date = new Date(_year, _month, _day);
    let days: Array<DateCalendar> = [];

    for (let i = -date.getDay(); i <= 6 - date.getDay(); i++) {
      let thisDate: Date = new Date(_year, _month, _day + i);
      days.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" }))
      });
    }

    return [days];
  };

  // ROWS
  const getNumberOfRows = useCallback((): number => {
    if (calendarView == "Month") return getNumberOfRowsInMonth();
    return 1;
  }, [calendarView, month, year]);

  const getNumberOfRowsInMonth = useCallback((): number => {
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

  // MATRIX
  const createMatrix = useCallback((): Array<Array<DateCalendar>> => {
    if (calendarView == "Month") return createMatrixMonth();
    if (calendarView == "Week") return getDaysInWeek(month, year, currDay);
    return [];
  }, [calendarView, month, year, currDay]);

  const createMatrixMonth = useCallback((): Array<Array<DateCalendar>> => {
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

  // Return utils
  return {
    getNumberOfRows,
    createMatrix
  };
};
