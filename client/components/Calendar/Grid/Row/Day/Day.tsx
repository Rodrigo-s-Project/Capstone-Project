import styles from "./Day.module.scss";
import { DateCalendar } from "../../../../../hooks/useDates";
import {
  useContext,
  useCallback,
  Fragment,
  Dispatch,
  SetStateAction
} from "react";

import { CalendarContext } from "../../../Calendar";
import { GlobalContext } from "../../../../../pages/_app";

import { TaskType } from "../../../../../routes/calendar.routes";
import Task from "./Task/Task";

// Icons
import PlusIcon from "../../../../Svgs/Plus";

type Props = {
  day: DateCalendar;
  isToday: boolean;
  matrixDates: Array<Array<DateCalendar>>;
  setMatrixDates: Dispatch<SetStateAction<Array<Array<DateCalendar>>>>;
};

const Day = ({ day, isToday, matrixDates, setMatrixDates }: Props) => {
  const { currDay, month, year, calendarView, isCalendarLoading } = useContext(
    CalendarContext
  );
  const { setModalPopUpCreateTask, setDayClick } = useContext(GlobalContext);

  const isAnotherMonth = useCallback(
    (day: Date): boolean => {
      const _year: any = year;
      const _month: any = month;
      const _currDay: any = currDay;
      if (
        !Number.isFinite(_year) ||
        !Number.isFinite(_month) ||
        !Number.isFinite(_currDay)
      )
        return false;

      const thisDate: Date = new Date(day);
      const currDate: Date = new Date(_year, _month, currDay);

      return thisDate.getMonth() != currDate.getMonth();
    },
    [currDay, month, year]
  );

  const createTask = () => {
    if (setModalPopUpCreateTask && setDayClick) {
      setDayClick(day);
      setModalPopUpCreateTask(true);
    }
  };

  const onHoverEditToDateTask = useCallback(() => {
    if (!matrixDates) return;
    let newMatrix: Array<Array<DateCalendar>> = [];
    let coordenatesToEdit: Array<Array<number>> = [];
    let coordenatesToEditArrayIds: Array<number> = [];

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

            if (taskRefLoop.isResizing) {
              // Task that is resizing
              newArrayTasks.push({
                ...element.tasks[k],
                taskRef: {
                  ...element.tasks[k].taskRef,
                  toDate: day.date.getTime(),
                  singleDate:
                    day.date.getTime() == element.tasks[k].taskRef.fromDate
                }
              });

              if (
                !coordenatesToEditArrayIds.includes(element.tasks[k].taskRef.id)
              ) {
                // Multiple task
                // Then add to coordenates
                coordenatesToEdit.push([i, j, k]);
                coordenatesToEditArrayIds.push(element.tasks[k].taskRef.id);
              }
            } else {
              newArrayTasks.push(taskRefLoop);
            }
          }

          // We need to create replicas from resizing -> toDate
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

    createReplicas(newMatrix, coordenatesToEdit);
  }, [matrixDates, setMatrixDates]);

  const checkIfAlreadytaskInDay = (
    includesArr: Array<TaskType>,
    task: TaskType
  ): boolean => {
    let isThere: boolean = false;

    for (let i = 0; i < includesArr.length; i++) {
      if (includesArr[i].taskRef.id == task.taskRef.id) {
        isThere = true;
        break;
      }
    }

    return isThere;
  };
  const createReplicas = (
    matrixWithState: Array<Array<DateCalendar>>,
    coordenatesToEdit: Array<Array<number>>
  ) => {
    let replicaMatrix: Array<Array<DateCalendar>> = matrixWithState;

    for (let i = 0; i < coordenatesToEdit.length; i++) {
      const c: Array<number> = coordenatesToEdit[i];
      let row = matrixWithState[c[0]];
      let singleDate = row[c[1]];
      if (!singleDate.tasks) continue;

      let taskToEditToReplicate: TaskType | undefined = singleDate.tasks[c[2]];
      let toDateTaskForReference: number = taskToEditToReplicate.taskRef.toDate;
      let fromDateTaskForReference: number =
        taskToEditToReplicate.taskRef.fromDate;

      let isSwap = false;
      let areEqual = false;
      if (fromDateTaskForReference > toDateTaskForReference) {
        isSwap = true;
      }

      if (fromDateTaskForReference == toDateTaskForReference) {
        areEqual = true;
      }

      // Start running to matrixWithState
      // We are going to start at our current indexes
      for (let j = 0; j < matrixWithState.length; j++) {
        for (let k = 0; k < matrixWithState[j].length; k++) {
          // Delete all tasks and then add final if are equal
          if (areEqual) {
            let currTasksOnState: Array<TaskType> | undefined =
              matrixWithState[j][k].tasks;
            let auxArr: Array<TaskType> = [];
            if (currTasksOnState) {
              auxArr = [...auxArr, ...currTasksOnState];
            }
            let currDate: number = matrixWithState[j][k].date.getTime();
            if (currDate != fromDateTaskForReference) {
              // Destroy it
              let newAuxArr: Array<TaskType> = [];
              for (let indexAux = 0; indexAux < auxArr.length; indexAux++) {
                if (
                  auxArr[indexAux].taskRef.id !=
                  taskToEditToReplicate.taskRef.id
                ) {
                  newAuxArr.push(auxArr[indexAux]);
                }
              }
              auxArr = newAuxArr;
            }
            replicaMatrix[j][k].tasks = auxArr;
          } else {
            let singleDateNext = matrixWithState[j][k];
            if (
              (!isSwap &&
                singleDateNext.date.getTime() >= fromDateTaskForReference) ||
              (isSwap &&
                singleDateNext.date.getTime() <= fromDateTaskForReference)
            ) {
              const toDateNow: number = singleDateNext.date.getTime();
              // Start making or deleting tasks

              // ---------------- Create
              if (
                (!isSwap && toDateTaskForReference >= toDateNow) ||
                (isSwap && toDateTaskForReference <= toDateNow)
              ) {
                // We are still between or in the tail
                // replicate taskToEditToReplicate in this location
                let currTasksOnState: Array<TaskType> | undefined =
                  matrixWithState[j][k].tasks;
                let auxArr: Array<TaskType> = [];
                if (currTasksOnState) {
                  auxArr = [...auxArr, ...currTasksOnState];
                }

                // We need to add this before current state
                // Check if it is already there or not
                if (
                  taskToEditToReplicate &&
                  !checkIfAlreadytaskInDay(auxArr, taskToEditToReplicate)
                ) {
                  auxArr = [taskToEditToReplicate, ...auxArr];
                }

                replicaMatrix[j][k].tasks = auxArr;
              }

              // ---------------- Delete
              if (
                (!isSwap && toDateTaskForReference < toDateNow) ||
                (isSwap && toDateTaskForReference > toDateNow)
              ) {
                // We are further
                // This means that we dont need further tasks with this id
                let currTasksOnState: Array<TaskType> | undefined =
                  matrixWithState[j][k].tasks;
                let auxArr: Array<TaskType> = [];
                if (currTasksOnState) {
                  auxArr = [...auxArr, ...currTasksOnState];
                }
                if (checkIfAlreadytaskInDay(auxArr, taskToEditToReplicate)) {
                  // It is inside
                  // Destroy it
                  let newAuxArr: Array<TaskType> = [];
                  for (let indexAux = 0; indexAux < auxArr.length; indexAux++) {
                    if (
                      auxArr[indexAux].taskRef.id !=
                      taskToEditToReplicate.taskRef.id
                    ) {
                      newAuxArr.push(auxArr[indexAux]);
                    }
                  }
                  auxArr = newAuxArr;
                }
                replicaMatrix[j][k].tasks = auxArr;
              }
            }
          }
        }
      }
    }

    setMatrixDates(replicaMatrix);
  };

  return (
    <div
      className={`${styles.day} ${isToday && styles.day_today} ${isAnotherMonth(
        day.date
      ) && styles.day_anotherMonth} ${calendarView == "Day" &&
        styles.day_day} ${(isCalendarLoading || day.dontShow) &&
        styles.loader}`}
      onMouseEnter={onHoverEditToDateTask}
    >
      {!day.dontShow && (
        <>
          <div className={styles.day_number}>{day.day}</div>
          <div className={styles.day_plus} onClick={createTask}>
            <PlusIcon />
          </div>
          <div className={styles.tasks}>
            {day.tasks &&
              day.tasks.length > 0 &&
              day.tasks.map((task: TaskType, index: number) => {
                return (
                  <Fragment key={index}>
                    <Task
                      matrixDates={matrixDates}
                      setMatrixDates={setMatrixDates}
                      task={task}
                      day={day}
                    />
                  </Fragment>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Day;
