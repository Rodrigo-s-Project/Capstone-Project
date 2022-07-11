import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getAllTasksCalendar,
  createTaskCalendar
} from "../controllers/calendar/index";

// Protected route
router.get(
  "/get-tasks/:teamId/:fromDate/:toDate",
  authenticate,
  getAllTasksCalendar
);
router.post(
  "/create-task/:teamId/:calendarId",
  authenticate,
  createTaskCalendar
);

export default router;
