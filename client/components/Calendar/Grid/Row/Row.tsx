import styles from "./Row.module.scss";
import { DateCalendar } from "../Grid";

type Props = {
  datesRow: Array<DateCalendar>;
};

const Row = ({ datesRow }: Props) => {
  return (
    <div className={styles.row}>
      {datesRow &&
        datesRow.map((date: DateCalendar, index: number) => {
          return <div key={index}>{date.day}</div>;
        })}
    </div>
  );
};

export default Row;
