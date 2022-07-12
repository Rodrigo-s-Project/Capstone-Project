import styles from "./Task.module.scss";
import {
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect
} from "react";
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

  const dragStarts = useCallback(() => {
    if (!matrixDates) return;
    let newMatrix: Array<Array<DateCalendar>> = [];

    for (let i = 0; i < matrixDates.length; i++) {
      const rowElement = matrixDates[i];
      let newMatrixRow: Array<DateCalendar> = [];

      for (let j = 0; j < rowElement.length; j++) {
        let element = rowElement[j];

        if (element.tasks) {
          // Ours, so we need to go deeper
          let newArrayTasks: Array<TaskType> | undefined = [];

          for (let k = 0; k < element.tasks.length; k++) {
            const taskRefLoop: TaskType = element.tasks[k];

            if (taskRefLoop.taskRef.id == task.taskRef.id) {
              // Our task... finally
              // So we need to edit its resizing
              newArrayTasks.push({
                ...element.tasks[k],
                isResizing: true
              });
            } else {
              newArrayTasks.push(taskRefLoop);
            }
          }
          newMatrixRow.push({
            date: rowElement[j].date,
            weekday: rowElement[j].weekday,
            day: rowElement[j].day,
            dontShow: rowElement[j].dontShow,
            tasks: newArrayTasks
          });
        } else {
          newMatrixRow.push(element);
        }
      }
      newMatrix.push(newMatrixRow);
    }

    setMatrixDates(newMatrix);
  }, [matrixDates, setMatrixDates]);

  const dragFinishes = useCallback(() => {
    // In this case we want to stablich all the tasks resizing to false
    if (!matrixDates) return;
    let newMatrix: Array<Array<DateCalendar>> = [];
    for (let i = 0; i < matrixDates.length; i++) {
      const rowElement = matrixDates[i];
      let newMatrixRow: Array<DateCalendar> = [];

      for (let j = 0; j < rowElement.length; j++) {
        let element = rowElement[j];
        if (element.tasks) {
          // Stablish to false
          for (let k = 0; k < element.tasks.length; k++) {
            element.tasks[k].isResizing = false;
          }
        }
        newMatrixRow.push(element);
      }
      newMatrix.push(newMatrixRow);
    }
    setMatrixDates(newMatrix);
  }, [matrixDates, setMatrixDates]);

  useEffect(() => {
    window.addEventListener("mouseup", dragFinishes);
    return () => {
      window.removeEventListener("mouseup", dragFinishes);
    };
  }, [matrixDates]);

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) {
          openTask();
        }
      }}
      className={`${styles.task} ${task.isResizing && styles.resize}`}
      title="Open task"
    >
      <div className={styles.resizer_left}></div>
      <div
        onMouseDown={dragStarts}
        onMouseUp={dragFinishes}
        className={styles.resizer_right}
      ></div>

      {task.taskRef.name}
      {task.tags.length > 0 && (
        <div onClick={openTask} className={styles.task_tags}>
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
