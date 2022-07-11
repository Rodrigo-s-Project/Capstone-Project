import styles from "./Task.module.scss";
import { useContext } from "react";
import { TaskType } from "../../../../../../routes/calendar.routes";
import { GlobalContext } from "../../../../../../pages/_app";
import { DateCalendar } from "../../../../../../hooks/useDates";

type Props = {
  task: TaskType;
  day: DateCalendar;
};

const Task = ({ task, day }: Props) => {
  const {
    setModalPopUpCreateTask,
    setDayClick,
    setNameTask,
    setDescriptionTask,
    setIsTaskModalOnEditing
  } = useContext(GlobalContext);

  const openTask = () => {
    if (
      setModalPopUpCreateTask &&
      setDayClick &&
      setNameTask &&
      setDescriptionTask &&
      setIsTaskModalOnEditing
    ) {
      setDayClick(day);
      setNameTask(task.taskRef.name);
      setDescriptionTask(task.taskRef.description);
      setIsTaskModalOnEditing(true);
      setModalPopUpCreateTask(true);
    }
  };

  return (
    <div onClick={openTask} className={styles.task} title="Open task">
      {task.taskRef.name}
    </div>
  );
};

export default Task;
