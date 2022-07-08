import styles from "./Day.module.scss";
import { DateCalendar } from "../../Grid";

type Props = {
  day: DateCalendar;
  isToday: boolean;
  isAnotherMonth: boolean;
};

const Day = ({ day, isToday, isAnotherMonth }: Props) => {
  return (
    <div
      className={`${styles.day} ${isToday &&
        styles.day_today} ${isAnotherMonth && styles.day_anotherMonth}`}
    >
      <div className={styles.day_number}>{day.day}</div>
    </div>
  );
};

export default Day;
