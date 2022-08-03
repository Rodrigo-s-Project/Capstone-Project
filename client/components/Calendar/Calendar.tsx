import { useContext, useState } from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Calendar.module.scss";

// Components
import TopCalendar from "./Top/Top";
import GridCalendar from "./Grid/Grid";
import CommentIcon from "../Svgs/Comment";
import Bot from "./Bot/Bot";

const Calendar = () => {
  const { selectedTeam } = useContext(GlobalContext);
  const [isBotOpen, setIsBotOpen] = useState<boolean>(false);

  return (
    <div className={styles.calendar}>
      <h1>{selectedTeam && selectedTeam.name}&apos;s Calendar</h1>
      <div className={styles.calendar_container}>
        <TopCalendar />
        <GridCalendar />
      </div>
      <div
        onClick={() => {
          setIsBotOpen(prev => !prev);
        }}
        title="Open chat bot"
        className={styles.bot}
      >
        <CommentIcon />
      </div>
      {isBotOpen && <Bot />}
    </div>
  );
};
export default Calendar;
