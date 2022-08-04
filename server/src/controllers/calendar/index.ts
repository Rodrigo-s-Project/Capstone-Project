import { RESPONSE } from "../controllers.types";
import { Task } from "../../models/Task";
import { User } from "../../models/User";
import { Calendar } from "../../models/Calendar";
import { Tag } from "../../models/Tag";
import { Team } from "../../models/Team";
import { Op } from "sequelize";
import {
  BODY_CREATE_TASK,
  BODY_CREATE_TAG,
  BODY_CREATE_TASK_BOT
} from "./calendar.types";

export const getAllTasksCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, fromDate, toDate } = req.params;

    if (isNaN(teamId) || isNaN(fromDate) || isNaN(toDate)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const teamRef: any = await Team.findByPk(teamId);

    if (!teamRef) {
      response.message = "Team not found.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    const arrayTasks: Array<any> = await Task.findAll({
      where: {
        calendarId: calendarRef.id,
        fromDate: {
          [Op.between]: [fromDate, toDate] // Between from and to
        }
      }
    });

    let tasks: Array<any> = [];
    for (let i = 0; i < arrayTasks.length; i++) {
      const users: Array<any> = await arrayTasks[i].getUsers();
      const tags: Array<any> = await arrayTasks[i].getTags();

      tasks.push({
        taskRef: arrayTasks[i],
        users,
        tags,
        isResizing: false // Always include
      });
    }

    const tagsCalendar: Array<any> = await calendarRef.getTags();
    const users: Array<any> = await teamRef.getUsers();

    response.data = {
      tasks,
      calendar: calendarRef,
      tagsCalendar,
      users
    };
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

const createBetweenTimes = (
  fromDate: number,
  toDate: number
): Array<number> => {
  let times: Array<number> = [];
  let date: Date = new Date(fromDate); // Start of and today

  while (date.getTime() <= toDate) {
    let thisDate: Date = new Date(date);
    times.push(thisDate.getTime());
    date.setDate(date.getDate() + 1);
  }

  return times;
};

const checkAvailabilityArrays = async (
  arrayUsers: Array<any>,
  index: number,
  currArray: Array<number>
): Promise<Array<number>> => {
  try {
    let newArr: Array<number> = currArray;

    if (index > arrayUsers.length - 1) return newArr;
    const userRef: any = await User.findByPk(parseInt(arrayUsers[index]));

    if (!userRef) return newArr;

    // get tasks
    const arrayTasks: Array<any> = await userRef.getTasks();

    for (let i = 0; i < arrayTasks.length; i++) {
      // If it is on currArray, delete it

      let arrTimesTasks: Array<number> = createBetweenTimes(
        parseInt(arrayTasks[i].fromDate),
        parseInt(arrayTasks[i].toDate)
      );

      for (let j = 0; j < arrTimesTasks.length; j++) {
        for (let k = 0; k < currArray.length; k++) {
          const currAvailableTime: number = currArray[k];
          const currNotAvailableTime: number = arrTimesTasks[j];

          if (currAvailableTime == currNotAvailableTime) {
            // Conflict
            newArr.splice(k, 1);
          }
        }
      }
    }

    return await checkAvailabilityArrays(arrayUsers, index + 1, newArr);
  } catch (error) {
    return [];
  }
};

export const createTaskCalendarBot = async (req, res, next) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { arrayUsers, times }: BODY_CREATE_TASK_BOT = req.body;

    // Calculate from
    // Loop month
    let fromDateBot: any = await checkAvailabilityArrays(
      [req.user.id, ...arrayUsers],
      0,
      times
    );

    if (fromDateBot.length == 0) {
      response.typeMsg = "info";
      response.message = "Not availablity";
      res.json(response);
      return;
    }
    req.body = {
      name: "Meeting",
      singleDate: true,
      fromDate: fromDateBot[0],
      toDate: fromDateBot[0],
      description: "Meeting",
      arrayUsers: [req.user.id, ...arrayUsers],
      arrayTags: []
    };

    next();
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const createTaskCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId } = req.params;
    const {
      name,
      singleDate,
      fromDate,
      toDate,
      description,
      arrayUsers,
      arrayTags
    }: BODY_CREATE_TASK = req.body;

    // Checks
    if (isNaN(teamId) || isNaN(fromDate) || isNaN(calendarId)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    if (name.trim() == "" || description.trim() == "") {
      response.message = "Incomplete information.";
      res.json(response);
      return;
    }

    // Create task
    const newTask: any = await Task.create({
      name,
      singleDate,
      fromDate: parseInt(fromDate),
      toDate: parseInt(toDate),
      description
    });

    calendarRef.addTask(newTask);

    // Relate with users
    for (let i = 0; i < arrayUsers.length; i++) {
      const userRef: any = await User.findByPk(arrayUsers[i]);
      if (!userRef) continue;

      await newTask.addUser(userRef);
    }

    // Relate tags
    for (let i = 0; i < arrayTags.length; i++) {
      const tagRef: any = await Tag.findByPk(arrayTags[i]);

      if (!tagRef) continue;

      await newTask.addTag(tagRef);
    }

    response.typeMsg = "success";
    response.message = "Task created!";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const createTagCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId } = req.params;
    const { text, color }: BODY_CREATE_TAG = req.body;

    // Checks
    if (isNaN(teamId) || isNaN(calendarId)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    if (text.trim() == "" || color.trim() == "") {
      response.message = "Incomplete information.";
      res.json(response);
      return;
    }

    // Create tag
    const newTag: any = await Tag.create({
      text,
      color
    });

    // We make the association
    calendarRef.addTag(newTag);

    response.readMsg = false;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const editTaskCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId, taskId } = req.params;
    const {
      name,
      singleDate,
      fromDate,
      toDate,
      description,
      arrayUsers,
      arrayTags
    }: BODY_CREATE_TASK = req.body;

    // Checks
    if (
      isNaN(teamId) ||
      isNaN(fromDate) ||
      isNaN(calendarId) ||
      isNaN(taskId)
    ) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    // Edit task
    const taskRef: any = await Task.findByPk(taskId);

    if (!taskRef) {
      response.message = "Task not found.";
      res.json(response);
      return;
    }

    if (!name || !description) {
      // Only dates
      await taskRef.update({
        singleDate,
        fromDate: parseInt(fromDate),
        toDate: parseInt(toDate)
      });
      response.readMsg = false;
    } else {
      if (name.trim() == "" || description.trim() == "") {
        response.message = "Incomplete information.";
        res.json(response);
        return;
      }

      await taskRef.update({
        name,
        singleDate,
        fromDate: parseInt(fromDate),
        toDate: parseInt(toDate),
        description
      });

      // Edit related users
      let arrayUsersRefs: Array<any> = [];
      for (let i = 0; i < arrayUsers.length; i++) {
        const userRef: any = await User.findByPk(arrayUsers[i]);

        if (!userRef) continue;
        arrayUsersRefs.push(userRef);
      }
      await taskRef.setUsers(arrayUsersRefs);

      // Edit related tags
      let arrayTagsRefs: Array<any> = [];
      for (let i = 0; i < arrayTags.length; i++) {
        const tagRef: any = await Tag.findByPk(arrayTags[i]);

        if (!tagRef) continue;
        arrayTagsRefs.push(tagRef);
      }
      await taskRef.setTags(arrayTagsRefs);
      response.typeMsg = "success";
      response.message = "Task edited successfully!";
    }

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const editTagCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId, tagId } = req.params;
    const { text, color }: BODY_CREATE_TAG = req.body;

    // Checks
    if (isNaN(teamId) || isNaN(calendarId) || isNaN(tagId)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    if (text.trim() == "" || color.trim() == "") {
      response.message = "Incomplete information.";
      res.json(response);
      return;
    }

    // Find tag
    const tagRef: any = await Tag.findByPk(tagId);

    if (!tagRef) {
      response.message = "Tag not found.";
      res.json(response);
      return;
    }

    await tagRef.update({
      text,
      color
    });

    response.readMsg = false;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const deleteTagCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId, tagId } = req.params;

    // Checks
    if (isNaN(teamId) || isNaN(calendarId) || isNaN(tagId)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    // Find tag
    const tagRef: any = await Tag.findByPk(tagId);

    if (!tagRef) {
      response.message = "Tag not found.";
      res.json(response);
      return;
    }

    // Unassociate with calendar
    calendarRef.removeTag(tagRef);

    // Unassociate with tasks
    const tasksRef: any = await Task.findAll({
      where: {
        calendarId
      }
    });

    for (let i = 0; i < tasksRef.length; i++) {
      const needsToRemove: any = await tasksRef[i].hasTag(tagRef);

      if (needsToRemove) {
        await tasksRef[i].removeTag(tagRef);
      }
    }

    // Destroy tag
    await tagRef.destroy();

    response.readMsg = false;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const deleteTaskCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { teamId, calendarId, taskId } = req.params;

    // Checks
    if (isNaN(teamId) || isNaN(taskId) || isNaN(calendarId)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const calendarRef: any = await Calendar.findOne({
      where: {
        teamId
      }
    });

    if (!calendarRef) {
      response.message = "Calendar not found.";
      res.json(response);
      return;
    }

    const taskref: any = await Task.findByPk(taskId);

    if (!taskref) {
      response.message = "Task not found.";
      res.json(response);
      return;
    }

    // Unassociate with calendar
    calendarRef.removeTask(taskref);

    // Unassociate sith set()
    await taskref.setUsers([]);
    await taskref.setTags([]);

    // Destroy
    await taskref.destroy();

    response.typeMsg = "success";
    response.message = "Task deleted!";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {
      tasks: [],
      calendar: {},
      tagsCalendar: {}
    };
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
