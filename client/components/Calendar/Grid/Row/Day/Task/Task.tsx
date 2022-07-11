import styles from "./Task.module.scss";

import { TaskType } from "../../../../../../routes/calendar.routes";

type Props = {
  task: TaskType;
};

const Task = ({ task }: Props) => {
  return (
    <div className={styles.task} title="Open task">
      {task.taskRef.name}
    </div>
  );
};

export default Task;
