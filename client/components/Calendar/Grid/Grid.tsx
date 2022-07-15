import styles from "./Grid.module.scss";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";

import { CalendarContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";
import RowElement, { RowHeader } from "./Row/Row";
import axios from "axios";

import { editTask } from "../../../routes/calendar.routes";
import { RESPONSE } from "../../../routes/index.routes";

// Hooks
import { useDates, DateCalendar } from "../../../hooks/useDates";

const matrixStarter = {
  date: new Date(),
  weekday: "",
  day: 0,
  tasks: undefined,
  isOnHover: false,
  isResizing: false,
  dontShow: true
};

const Grid = () => {
  // Context
  const {
    month,
    year,
    calendarStretchRow,
    setCalendarStretchRow,
    calendarView,
    taskIdResizing,
    fromTaskResizing,
    toTaskResizing,
    setIsResizing,
    setTaskIdResizing,
    setFromTaskResizing,
    isResizing,
    setIsResizingFromRight,
    setRefetchTasks,
    refetchTasks
  } = useContext(CalendarContext);
  const [matrixDates, setMatrixDates] = useState<Array<Array<DateCalendar>>>([
    Array(7).fill(matrixStarter),
    Array(7).fill(matrixStarter),
    Array(7).fill(matrixStarter),
    Array(7).fill(matrixStarter),
    Array(7).fill(matrixStarter),
    Array(7).fill(matrixStarter)
  ]);

  // Hook
  const { createMatrix, getNumberOfRows } = useDates();
  const { selectedTeam, selectedCompany, setArrayMsgs } = useContext(
    GlobalContext
  );

  const generateMatrix = useCallback(async () => {
    const matrix = await createMatrix();

    setMatrixDates(matrix);
  }, [createMatrix, setMatrixDates]);

  useEffect(() => {
    generateMatrix();
  }, [
    setMatrixDates,
    month,
    year,
    createMatrix,
    generateMatrix,
    selectedTeam,
    refetchTasks
  ]);

  useEffect(() => {
    // To fix bug when changing from "day" or "week" to "month view"
    // The row was shrinked to the prev view
    if (calendarView == "Month" && matrixDates.length < 3) {
      setMatrixDates([
        Array(7).fill(matrixStarter),
        Array(7).fill(matrixStarter),
        Array(7).fill(matrixStarter),
        Array(7).fill(matrixStarter),
        Array(7).fill(matrixStarter),
        Array(7).fill(matrixStarter)
      ]);
    }
  }, [calendarView, matrixDates.length]);

  const editTaskFetch = useCallback(async () => {
    try {
      if (
        !selectedTeam ||
        !selectedCompany ||
        !fromTaskResizing ||
        !toTaskResizing
      )
        return;

      const body: any = {
        singleDate:
          toTaskResizing == 0 ? true : fromTaskResizing == toTaskResizing,
        fromDate: Math.min(
          fromTaskResizing,
          toTaskResizing == 0 ? fromTaskResizing : toTaskResizing
        ),
        toDate: Math.max(
          fromTaskResizing,
          toTaskResizing == 0 ? fromTaskResizing : toTaskResizing
        )
      };

      const response = await axios.put(
        editTask.url(selectedTeam.id, selectedCompany.id, taskIdResizing),
        body,
        {
          withCredentials: true
        }
      );

      const data: RESPONSE = response.data;
      if (data.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
      // Refetch
      if (setRefetchTasks) setRefetchTasks(prev => !prev);
      if (setIsResizing) setIsResizing(false);
      if (setTaskIdResizing) setTaskIdResizing(0);
      if (setFromTaskResizing) setFromTaskResizing(0);
      if (setIsResizingFromRight) setIsResizingFromRight(true);
    } catch (error) {
      console.error(error);
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Error on edit task!"
          },
          ...prev
        ]);
      }
    }
  }, [
    selectedTeam,
    selectedCompany,
    fromTaskResizing,
    toTaskResizing,
    taskIdResizing,
    setArrayMsgs,
    setRefetchTasks,
    setIsResizing,
    setTaskIdResizing,
    setFromTaskResizing,
    setIsResizingFromRight
  ]);

  const dragFinishes = useCallback(async () => {
    // In this case we want to stablish all the tasks resizing to false
    if (!matrixDates) return;
    if (!isResizing) return;

    await editTaskFetch();
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
  }, [matrixDates, setMatrixDates, isResizing, editTaskFetch]);

  useEffect(() => {
    window.addEventListener("mouseup", dragFinishes);
    return () => {
      window.removeEventListener("mouseup", dragFinishes);
    };
  }, [matrixDates, dragFinishes]);

  return (
    <div
      style={{
        gridTemplateRows: `30px repeat(${getNumberOfRows()}, ${
          calendarView == "Month" ? calendarStretchRow : "1fr"
        })`
      }}
      className={styles.grid}
    >
      <RowHeader
        click={() => {
          if (setCalendarStretchRow)
            setCalendarStretchRow(prev => (prev == "20vh" ? "1fr" : "20vh"));
        }}
        calendarStretchRow={calendarStretchRow}
        daysOfWeek={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      />
      {[...Array(getNumberOfRows())].map((_: any, index: number) => {
        return (
          <Fragment key={index}>
            <RowElement
              matrixDates={matrixDates}
              setMatrixDates={setMatrixDates}
              datesRow={matrixDates[index]}
            />
          </Fragment>
        );
      })}
    </div>
  );
};
export default Grid;
