import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getAllTasksCalendar,
  createTaskCalendar,
  createTagCalendar
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
router.post("/create-tag/:teamId/:calendarId", authenticate, createTagCalendar);

export default router;
