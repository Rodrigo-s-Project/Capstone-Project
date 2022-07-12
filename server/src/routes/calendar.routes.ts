import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getAllTasksCalendar,
  createTaskCalendar,
  createTagCalendar,
  editTaskCalendar,
  editTagCalendar,
  deleteTagCalendar
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
router.put(
  "/edit-task/:teamId/:calendarId/:taskId",
  authenticate,
  editTaskCalendar
);
router.post("/create-tag/:teamId/:calendarId", authenticate, createTagCalendar);
router.put(
  "/edit-tag/:teamId/:calendarId/:tagId",
  authenticate,
  editTagCalendar
);
router.delete(
  "/delete-tag/:teamId/:calendarId/:tagId",
  authenticate,
  deleteTagCalendar
);

export default router;
