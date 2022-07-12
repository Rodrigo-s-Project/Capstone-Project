import { DATA_GET_USER } from "./main.routes";

export type TaskType = {
  taskRef: {
    id: number;
    name: string;
    description: string;
    fromDate: number;
    singleDate: boolean;
    toDate: number;
  };
  users: Array<{
    id: number;
    email: string;
    globalUsername: string;
    status: string;
    profilePictureURL: string;
    isDarkModeOn: boolean;
  }>;
  tags: Array<{
    id: number;
    color: string;
    text: string;
    calendarId: number;
    taskId: number;
  }>;
};

export type DATA_GET_TASKS = {
  tasks: Array<TaskType>;
  calendar: {
    id: number;
    teamId: number;
  };
  tagsCalendar: Array<{
    id: number;
    color: string;
    text: string;
    calendarId: number;
    taskId: number;
  }>;
  users: Array<DATA_GET_USER>;
};

export const getAllTasks = {
  url: (teamId: any, fromDate: any, toDate: any) =>
    `${process.env.API_URL}/dashboard/calendar/get-tasks/${teamId}/${fromDate}/${toDate}`,
  method: "get"
};

export type BODY_CREATE_TASK = {
  name: string;
  singleDate: boolean;
  fromDate: number;
  toDate: number;
  description: string;
  arrayUsers: Array<string>;
  arrayTags: Array<string>;
};

export const createTask = {
  url: (teamId: any, calendarId: any) =>
    `${process.env.API_URL}/dashboard/calendar/create-task/${teamId}/${calendarId}`,
  method: "post"
};

export type BODY_CREATE_TAG = {
  text: string;
  color: string;
};

export const createTag = {
  url: (teamId: any, calendarId: any) =>
    `${process.env.API_URL}/dashboard/calendar/create-tag/${teamId}/${calendarId}`,
  method: "post"
};

export type BODY_EDIT_TASK = {
  name: string;
  singleDate: any;
  fromDate: number;
  toDate: any;
  description: string;
  arrayUsers: Array<string>;
  arrayTags: Array<string>;
};

export const editTask = {
  url: (teamId: any, calendarId: any, taskId: any) =>
    `${process.env.API_URL}/dashboard/calendar/edit-task/${teamId}/${calendarId}/${taskId}`,
  method: "put"
};

export type BODY_EDIT_TAG = {
  text: string;
  color: string;
};

export const editTag = {
  url: (teamId: any, calendarId: any, tagId: any) =>
    `${process.env.API_URL}/dashboard/calendar/edit-tag/${teamId}/${calendarId}/${tagId}`,
  method: "put"
};

export const deleteTag = {
  url: (teamId: any, calendarId: any, tagId: any) =>
    `${process.env.API_URL}/dashboard/calendar/delete-tag/${teamId}/${calendarId}/${tagId}`,
  method: "delete"
};

export const deleteTask = {
  url: (teamId: any, calendarId: any, taskId: any) =>
    `${process.env.API_URL}/dashboard/calendar/delete-task/${teamId}/${calendarId}/${taskId}`,
  method: "delete"
};
