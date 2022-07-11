import styles from "./Grid.module.scss";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";

import { CalendarContext } from "../Calendar";
import { GlobalContext } from "../../../pages/_app";
import RowElement, { RowHeader } from "./Row/Row";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants } from "../../../animations/fade";

// Hooks
import { useDates, DateCalendar } from "../../../hooks/useDates";

// Components
import Loader from "../../Loader/Spinner/Spinner";

const Grid = () => {
  // Context
  const {
    month,
    year,
    calendarStretchRow,
    setCalendarStretchRow,
    calendarView,
    isCalendarLoading
  } = useContext(CalendarContext);
  const [matrixDates, setMatrixDates] = useState<Array<Array<DateCalendar>>>(
    []
  );

  // Hook
  const { createMatrix } = useDates();
  const { selectedTeam, refetchTasks } = useContext(GlobalContext);

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

  return (
    <AnimatePresence exitBeforeEnter>
      {isCalendarLoading ? (
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={styles.loader}
        >
          <Loader color="lavender-300" />
        </motion.div>
      ) : (
        <motion.div
          style={{
            gridTemplateRows: `30px repeat(${matrixDates.length}, ${
              calendarView == "Month" ? calendarStretchRow : "1fr"
            })`
          }}
          className={styles.grid}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <RowHeader
            click={() => {
              if (setCalendarStretchRow)
                setCalendarStretchRow(prev =>
                  prev == "20vh" ? "1fr" : "20vh"
                );
            }}
            calendarStretchRow={calendarStretchRow}
            daysOfWeek={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          />
          {[...Array(matrixDates.length)].map((_: any, index: number) => {
            return (
              <Fragment key={index}>
                <RowElement datesRow={matrixDates[index]} />
              </Fragment>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Grid;
