import styles from "./Task.module.scss";
import { useContext } from "react";
import { TaskType } from "../../../../../../routes/calendar.routes";
import { GlobalContext } from "../../../../../../pages/_app";
import { DateCalendar } from "../../../../../../hooks/useDates";
import { invertColor } from "../../../../../../utils/invertColors";

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
    setIsTaskModalOnEditing,
    setUsersTask,
    setTagsTask,
    setIdTask,
    setIsSingleDateTask,
    setFromTask,
    setToTask
  } = useContext(GlobalContext);

  const openTask = () => {
    if (
      setModalPopUpCreateTask &&
      setDayClick &&
      setNameTask &&
      setDescriptionTask &&
      setIsTaskModalOnEditing &&
      setUsersTask &&
      setTagsTask &&
      setIdTask &&
      setIsSingleDateTask &&
      setFromTask &&
      setToTask
    ) {
      setDayClick(day);
      setIdTask(task.taskRef.id);
      setIsSingleDateTask(task.taskRef.singleDate);
      setFromTask(task.taskRef.fromDate);
      setToTask(task.taskRef.toDate);
      setNameTask(task.taskRef.name);
      setDescriptionTask(task.taskRef.description);
      setIsTaskModalOnEditing(true);
      setModalPopUpCreateTask(true);

      let aux: Array<any> = [];
      for (let i = 0; i < task.users.length; i++) {
        aux.push(task.users[i].id);
      }

      setUsersTask(aux);

      let auxTags: Array<any> = [];
      for (let i = 0; i < task.tags.length; i++) {
        auxTags.push(task.tags[i].id);
      }

      setTagsTask(auxTags);
    }
  };

  return (
    <div onClick={openTask} className={styles.task} title="Open task">
      {task.taskRef.name}
      {task.tags.length > 0 && (
        <div className={styles.task_tags}>
          {task.tags.map(
            (
              tag: {
                text: string;
                id: number;
                color: string;
              },
              index: number
            ) => {
              return (
                <div
                  style={{
                    backgroundColor: tag.color,
                    color: invertColor(tag.color, true)
                  }}
                  key={index}
                >
                  {tag.text}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Task;
