export type DATA_GET_TASKS = {
  tasks: Array<{
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
  }>;
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

export type BODY_CREATE_TAG = {
  text: string;
  color: string;
};
