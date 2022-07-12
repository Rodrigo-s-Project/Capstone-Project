import { useCallback, useContext } from "react";

import { CalendarContext } from "../components/Calendar/Calendar";
import { GlobalContext } from "../components/../pages/_app";
import {
  TaskType,
  getAllTasks,
  DATA_GET_TASKS
} from "../routes/calendar.routes";
import { RESPONSE } from "../routes/index.routes";
import axios from "axios";

export type DateCalendar = {
  date: Date;
  weekday: string;
  day: number;
  tasks: Array<TaskType> | undefined;
  isOnHover: boolean;
  isResizing: boolean;
  dontShow?: boolean
};

export const useDates = () => {
  const {
    month,
    year,
    calendarView,
    currDay,
    setIsCalendarLoading
  } = useContext(CalendarContext);
  const {
    setArrayMsgs,
    selectedTeam,
    setAllUsersCalendar,
    setAllTagsCalendar
  } = useContext(GlobalContext);

  const fetchTasks = useCallback(
    async (
      time: number,
      latestTime: number
    ): Promise<DATA_GET_TASKS | undefined> => {
      try {
        if (!selectedTeam) return undefined;

        if (setIsCalendarLoading) setIsCalendarLoading(true);

        const response = await axios.get(
          getAllTasks.url(selectedTeam.id, time, latestTime),
          {
            withCredentials: true
          }
        );

        if (setIsCalendarLoading) setIsCalendarLoading(false);

        const data: RESPONSE = response.data;
        const dataResponse: DATA_GET_TASKS = data.data;

        if (setAllUsersCalendar && setAllTagsCalendar) {
          setAllUsersCalendar(dataResponse.users);
          setAllTagsCalendar(dataResponse.tagsCalendar);
        }

        return dataResponse;
      } catch (error) {
        if (setIsCalendarLoading) setIsCalendarLoading(false);
        console.error(error);
        if (setArrayMsgs) {
          setArrayMsgs(prev => [
            {
              type: "danger",
              text: "Error on fetching tasks!"
            },
            ...prev
          ]);
        }

        return undefined;
      }
    },
    [selectedTeam, setAllUsersCalendar, setAllTagsCalendar]
  );

  const getTaskType = (allTasks: DATA_GET_TASKS, fromDate: number) => {
    let res: Array<TaskType> = [];

    if (!allTasks.tasks) return [];

    for (let i = 0; i < allTasks.tasks.length; i++) {
      if (fromDate == allTasks.tasks[i].taskRef.fromDate) {
        res.push(allTasks.tasks[i]);
      }
    }

    return res;
  };

  // FETCHING
  const getDaysInMonth = async (
    _month: any,
    _year: any,
    needsToFetch: boolean = true
  ): Promise<Array<DateCalendar>> => {
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) return [];

    let date: Date = new Date(_year, _month, 1);
    let allTasks: DATA_GET_TASKS | undefined = undefined;

    if (needsToFetch) {
      allTasks = await fetchTasks(
        new Date(_year, _month - 2, 1).getTime(),
        new Date(_year, _month + 1, 1).getTime()
      );
    }

    if (!allTasks || !needsToFetch) {
      let days: Array<DateCalendar> = [];
      while (date.getMonth() === _month) {
        let thisDate: Date = new Date(date);
        days.push({
          date: thisDate,
          weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
          day: parseInt(
            thisDate.toLocaleDateString("en-US", { day: "numeric" })
          ),
          tasks: [],
          isOnHover: false,
          isResizing: false
        });
        date.setDate(date.getDate() + 1);
      }
      return days;
    }

    // With data
    let dateData: Date = new Date(_year, _month, 1);
    let daysData: Array<DateCalendar> = [];
    while (dateData.getMonth() === _month) {
      let thisDate: Date = new Date(dateData);
      daysData.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" })),
        tasks: getTaskType(allTasks, thisDate.getTime()),
        isOnHover: false,
        isResizing: false
      });
      dateData.setDate(dateData.getDate() + 1);
    }

    return daysData;
  };

  const getDaysInMonthStatic = (
    _month: any,
    _year: any
  ): Array<DateCalendar> => {
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) return [];
    let date: Date = new Date(_year, _month, 1);
    let days: Array<DateCalendar> = [];
    while (date.getMonth() === _month) {
      let thisDate: Date = new Date(date);
      days.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" })),
        tasks: [],
        isOnHover: false,
        isResizing: false
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDaysInWeek = async (
    _month: any,
    _year: any,
    _day: any
  ): Promise<Array<Array<DateCalendar>>> => {
    if (
      !Number.isFinite(_year) ||
      !Number.isFinite(_month) ||
      !Number.isFinite(_day)
    )
      return [];

    let date: Date = new Date(_year, _month, _day);
    let date2: Date = new Date(_year, _month, _day + 7);
    const allTasks: DATA_GET_TASKS | undefined = await fetchTasks(
      date.getTime(),
      date2.getTime()
    );

    let days: Array<DateCalendar> = [];

    if (!allTasks) {
      for (let i = -date.getDay(); i <= 6 - date.getDay(); i++) {
        let thisDate: Date = new Date(_year, _month, _day + i);
        days.push({
          date: thisDate,
          weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
          day: parseInt(
            thisDate.toLocaleDateString("en-US", { day: "numeric" })
          ),
          tasks: [],
          isOnHover: false,
          isResizing: false
        });
      }

      return [days];
    }

    // With Data
    for (let i = -date.getDay(); i <= 6 - date.getDay(); i++) {
      let thisDate: Date = new Date(_year, _month, _day + i);
      days.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" })),
        tasks: getTaskType(allTasks, thisDate.getTime()),
        isOnHover: false,
        isResizing: false
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
    const dates: Array<DateCalendar> = getDaysInMonthStatic(month, year);
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
  const createMatrix = useCallback(async (): Promise<
    Array<Array<DateCalendar>>
  > => {
    if (calendarView == "Month") return await createMatrixMonth();
    if (calendarView == "Week")
      return await getDaysInWeek(month, year, currDay);
    if (calendarView == "Day")
      return await createMatrixDay(month, year, currDay);
    return [];
  }, [calendarView, month, year, currDay, selectedTeam]);

  const createMatrixDay = async (
    _month: any,
    _year: any,
    _day: any
  ): Promise<Array<Array<DateCalendar>>> => {
    if (
      !Number.isFinite(_year) ||
      !Number.isFinite(_month) ||
      !Number.isFinite(_day)
    )
      return [];

    // Get day
    let thisDate: Date = new Date(_year, _month, _day);

    let date: Date = new Date(_year, _month, _day - 1);
    let date2: Date = new Date(_year, _month, _day + 1);
    const allTasks: DATA_GET_TASKS | undefined = await fetchTasks(
      date.getTime(),
      date2.getTime()
    );

    let days: Array<DateCalendar> = [];

    if (allTasks) {
      // Data
      days.push({
        date: thisDate,
        weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
        day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" })),
        tasks: getTaskType(allTasks, thisDate.getTime()),
        isOnHover: false,
        isResizing: false
      });

      return [days];
    }
    // Static
    days.push({
      date: thisDate,
      weekday: thisDate.toLocaleDateString("en-US", { weekday: "long" }),
      day: parseInt(thisDate.toLocaleDateString("en-US", { day: "numeric" })),
      tasks: [],
      isOnHover: false,
      isResizing: false
    });

    return [days];
  };

  const createMatrixMonth = useCallback(async (): Promise<
    Array<Array<DateCalendar>>
  > => {
    let matrix: Array<Array<DateCalendar>> = [];
    const numberOfRows: number = await getNumberOfRows();
    const dates: Array<DateCalendar> = await getDaysInMonth(month, year, true);

    const auxMonth: any = month;
    const auxYear: any = year;

    if (!Number.isFinite(auxMonth) || !Number.isFinite(auxYear)) {
      return [];
    }

    // Build rows
    // FIRST ROW
    const prevMonth: number = auxMonth == 0 ? 11 : auxMonth - 1;
    const prevYear: number = auxMonth == 0 ? auxYear - 1 : auxYear;
    const prevDates: Array<DateCalendar> = await getDaysInMonth(
      prevMonth,
      prevYear,
      true
    );

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
    const nextDates: Array<DateCalendar> = await getDaysInMonth(
      nextMonth,
      nextYear,
      true
    );

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
  }, [month, year, getNumberOfRows, selectedTeam]);

  // Return utils
  return {
    getNumberOfRows,
    createMatrix
  };
};
