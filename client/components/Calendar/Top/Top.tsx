import styles from "./Top.module.scss";

import BtnChildren from "../../Buttons/BtnChildren/BtnChildren";
import { useContext, useCallback } from "react";
import { CalendarContext } from "../Calendar";

// Icons
import ChevronLeft from "../../Svgs/ChevronLeft";
import ChevronRight from "../../Svgs/ChevronRight";

const TopCalendar = () => {
  const {
    month,
    year,
    setMonth,
    setYear,
    calendarView,
    setCalendarView,
    setCurrDay,
    currDay
  } = useContext(CalendarContext);

  const getFormatedTitle = (_month: any, _year: any): string => {
    // Vars undefined
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) {
      return "";
    }

    let date: Date = new Date(_year, _month, 1);
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${_year}`;
  };

  const updateStates = useCallback(
    (newDate: Date, _year: any, _month: any, _currDay: any, aux: number) => {
      // Check month
      if (newDate.getMonth() != new Date(_year, _month, 1).getMonth()) {
        if (setMonth) setMonth(prev => prev + aux);
      }
      // Check year
      if (newDate.getFullYear() != new Date(_year, _month, 1).getFullYear()) {
        if (setYear) setYear(prev => prev + aux);
      }

      // Update state
      if (setCurrDay) setCurrDay(newDate.getDate());
    },
    [setMonth, setCurrDay, setYear]
  );

  const moveDirection = useCallback(
    (direction: "left" | "right") => {
      const aux: number = direction == "left" ? -1 : 1;

      // Month
      const _year: any = year;
      const _month: any = month;
      const _currDay: any = currDay;
      if (
        !Number.isFinite(_year) ||
        !Number.isFinite(_month) ||
        !Number.isFinite(_currDay)
      )
        return;

      if (calendarView == "Month" && setMonth && setYear) {
        if (direction == "left" && _month == 0) {
          setMonth(11);
          setYear(prev => prev + aux);
        } else if (direction == "right" && _month == 11) {
          setMonth(0);
          setYear(prev => prev + aux);
        } else {
          setMonth(prev => prev + aux);
        }
      } else if (calendarView == "Week") {
        updateStates(
          new Date(_year, _month, _currDay + aux * 7),
          _year,
          _month,
          _currDay,
          aux
        );
      } else if (calendarView == "Day") {
        updateStates(
          new Date(_year, _month, _currDay + aux),
          _year,
          _month,
          _currDay,
          aux
        );
      }
    },
    [year, month, currDay, calendarView, setMonth, setYear, updateStates]
  );

  const getToday = () => {
    if (setMonth && setYear && setCurrDay) {
      setMonth(new Date().getMonth());
      setYear(new Date().getFullYear());
      setCurrDay(new Date().getDate());
    }
  };

  return (
    <div className={styles.calendar_container_top}>
      <div className={styles.calendar_container_top_left}>
        <div className={styles.calendar_container_top_left_arrows}>
          <BtnChildren
            callback={() => {
              moveDirection("left");
            }}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-arrow-left-calendar"
            title="Previous table"
          >
            <ChevronLeft />
          </BtnChildren>
          <BtnChildren
            callback={() => {
              moveDirection("right");
            }}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-arrow-right-calendar"
            title="Next table"
          >
            <ChevronRight />
          </BtnChildren>
        </div>
        <BtnChildren
          callback={getToday}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-today-calendar"
        >
          Today
        </BtnChildren>
      </div>
      <div className={styles.calendar_container_top_center}>
        {getFormatedTitle(month, year)}
      </div>
      <div className={styles.calendar_container_top_right}>
        <BtnChildren
          callback={() => {
            if (window.innerWidth < 600) return;
            if (setCalendarView) setCalendarView("Month");
            getToday();
          }}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-month-calendar"
          isDisabled={calendarView != "Month"}
        >
          Month
        </BtnChildren>
        <BtnChildren
          callback={() => {
            if (window.innerWidth < 600) return;
            if (setCalendarView) setCalendarView("Week");
            getToday();
          }}
          color="lavender-300"
          border="round_5"
          isDisabled={calendarView != "Week"}
          additionalClass="btn-week-calendar"
        >
          Week
        </BtnChildren>
        <BtnChildren
          callback={() => {
            if (window.innerWidth < 600) return;
            if (setCalendarView) setCalendarView("Day");
            getToday();
          }}
          color="lavender-300"
          border="round_5"
          isDisabled={calendarView != "Day"}
          additionalClass="btn-day-calendar"
        >
          Day
        </BtnChildren>
      </div>
    </div>
  );
};

export default TopCalendar;
