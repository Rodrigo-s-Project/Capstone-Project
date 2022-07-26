import styles from "./Task.module.scss";
import { useContext, Dispatch, SetStateAction, useCallback } from "react";
import { TaskType } from "../../../../../../routes/calendar.routes";
import { GlobalContext } from "../../../../../../pages/_app";
import { DateCalendar } from "../../../../../../hooks/useDates";
import { invertColor } from "../../../../../../utils/invertColors";
import { CalendarContext } from "../../../../Provider";

type Props = {
  task: TaskType;
  day: DateCalendar;
  matrixDates: Array<Array<DateCalendar>>;
  setMatrixDates: Dispatch<SetStateAction<Array<Array<DateCalendar>>>>;
};

const Task = ({ task, day, matrixDates, setMatrixDates }: Props) => {
  const { setModalPopUpCreateTask } = useContext(GlobalContext);

  const {
    setIsResizing,
    setTaskIdResizing,
    setFromTaskResizing,
    setIsResizingFromRight,
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
  } = useContext(CalendarContext);

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

  const dragStarts = useCallback(
    (isResFromRight: boolean) => {
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

                if (
                  setIsResizing &&
                  setTaskIdResizing &&
                  setFromTaskResizing &&
                  setIsResizingFromRight
                ) {
                  setIsResizing(true);
                  setIsResizingFromRight(isResFromRight);
                  setTaskIdResizing(element.tasks[k].taskRef.id);
                  setFromTaskResizing(element.tasks[k].taskRef.fromDate);
                }
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
    },
    [
      matrixDates,
      setMatrixDates,
      setIsResizing,
      setTaskIdResizing,
      setFromTaskResizing,
      setIsResizingFromRight,
      task.taskRef.id
    ]
  );

  const hasControls = (): Array<boolean> => {
    return [
      task.taskRef.fromDate == day.date.getTime(),
      task.taskRef.toDate == day.date.getTime()
    ];
  };

  return (
    <div className={`${styles.task_all}`}>
      {hasControls()[0] && (
        <div
          onMouseDown={() => {
            dragStarts(false);
          }}
          className={styles.resizer_left}
        ></div>
      )}
      <div
        onClick={openTask}
        className={`${styles.task} ${task.isResizing && styles.resize}`}
        title="Open task"
      >
        <div>{task.taskRef.name}</div>
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
      {hasControls()[1] && (
        <div
          onMouseDown={() => {
            dragStarts(true);
          }}
          className={styles.resizer_right}
        ></div>
      )}
    </div>
  );
};

export default Task;
