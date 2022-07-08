import styles from "./Top.module.scss";

import BtnChildren from "../../Buttons/BtnChildren/BtnChildren";
import { useContext } from "react";
import { CalendarContext } from "../Calendar";

// Icons
import ChevronLeft from "../../Svgs/ChevronLeft";
import ChevronRight from "../../Svgs/ChevronRight";

const TopCalendar = () => {
  const { month, year, setMonth, setYear } = useContext(CalendarContext);

  const getFormatedTitle = (_month: any, _year: any): string => {
    // Vars undefined
    if (!Number.isFinite(_year) || !Number.isFinite(_month)) {
      return "";
    }

    let date: Date = new Date(_year, _month, 1);
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${_year}`;
  };

  return (
    <div className={styles.calendar_container_top}>
      <div className={styles.calendar_container_top_left}>
        <div className={styles.calendar_container_top_left_arrows}>
          <BtnChildren
            callback={() => {
              if (setMonth && setYear) {
                if (month == 0) {
                  setMonth(11);
                  setYear(prev => prev - 1);
                } else {
                  setMonth(prev => prev - 1);
                }
              }
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
              if (setMonth && setYear) {
                if (month == 11) {
                  setMonth(0);
                  setYear(prev => prev + 1);
                } else {
                  setMonth(prev => prev + 1);
                }
              }
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
          callback={() => {
            if (setMonth && setYear) {
              setMonth(new Date().getMonth());
              setYear(new Date().getFullYear());
            }
          }}
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
          callback={() => {}}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-month-calendar"
        >
          Month
        </BtnChildren>
        <BtnChildren
          callback={() => {}}
          color="lavender-300"
          border="round_5"
          isDisabled
          additionalClass="btn-week-calendar"
        >
          Week
        </BtnChildren>
        <BtnChildren
          callback={() => {}}
          color="lavender-300"
          border="round_5"
          isDisabled
          additionalClass="btn-day-calendar"
        >
          Day
        </BtnChildren>
      </div>
    </div>
  );
};

export default TopCalendar;
