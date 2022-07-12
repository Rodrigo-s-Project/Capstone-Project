import styles from "./Task.module.scss";
import { useContext, Dispatch, SetStateAction } from "react";
import { TaskType } from "../../../../../../routes/calendar.routes";
import { GlobalContext } from "../../../../../../pages/_app";
import { DateCalendar } from "../../../../../../hooks/useDates";
import { invertColor } from "../../../../../../utils/invertColors";

type Props = {
  task: TaskType;
  day: DateCalendar;
  matrixDates: Array<Array<DateCalendar>>;
  setMatrixDates: Dispatch<SetStateAction<Array<Array<DateCalendar>>>>;
};

const Task = ({ task, day, matrixDates, setMatrixDates }: Props) => {
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

  const dragStarts = () => {
    // if (!matrixDates) return;
    // let newMatrix: Array<Array<DateCalendar>> = [];

    // for (let i = 0; i < matrixDates.length; i++) {
    //   const rowElement = matrixDates[i];
    //   let newMatrixRow: Array<DateCalendar> = [];

    //   for (let j = 0; j < rowElement.length; j++) {
    //     const element = rowElement[j];

    //     if (element.day == day.day) {
    //       // Ours
    //       newMatrixRow.push({
    //         ...element,
    //         isResizing: true
    //       });
    //     } else {
    //       newMatrixRow.push(element);
    //     }
    //   }

    //   newMatrix.push(newMatrixRow);
    // }

    // setMatrixDates(newMatrix);
  };

  const dragFinishes = () => {};

  return (
    <div
      onMouseDown={dragStarts}
      onMouseUp={dragFinishes}
      onClick={openTask}
      className={styles.task}
      title="Open task"
    >
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
