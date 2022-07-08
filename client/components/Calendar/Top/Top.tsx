import styles from "./Top.module.scss";

import BtnChildren from "../../Buttons/BtnChildren/BtnChildren";

// Icons
import ChevronLeft from "../../Svgs/ChevronLeft";
import ChevronRight from "../../Svgs/ChevronRight";

const TopCalendar = () => {
  return (
    <div className={styles.calendar_container_top}>
      <div className={styles.calendar_container_top_left}>
        <div className={styles.calendar_container_top_left_arrows}>
          <BtnChildren
            callback={() => {}}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-arrow-left-calendar"
            title="Previous table"
          >
            <ChevronLeft />
          </BtnChildren>
          <BtnChildren
            callback={() => {}}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-arrow-right-calendar"
            title="Next table"
          >
            <ChevronRight />
          </BtnChildren>
        </div>
        <BtnChildren
          callback={() => {}}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-today-calendar"
        >
          Today
        </BtnChildren>
      </div>
      <div className={styles.calendar_container_top_center}>July 2022</div>
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
