import { RESPONSE } from "../controllers.types";
import { Task } from "../../models/Task";
import { User } from "../../models/User";
import { Calendar } from "../../models/Calendar";
import { Tag } from "../../models/Tag";
import { Op } from "sequelize";
import { BODY_CREATE_TASK } from "./calendar.types";

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
        tags
      });
    }

    const tagsCalendar: Array<any> = await calendarRef.getTags();

    response.data = {
      tasks,
      calendar: calendarRef,
      tagsCalendar
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

export const createTaskCalendar = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
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

    // Create task
    const newTask: any = await Task.create({
      name,
      singleDate,
      fromDate,
      toDate,
      description
    });

    calendarRef.addTask(newTask);

    // Relate with users
    for (let i = 0; i < arrayUsers.length; i++) {
      const userRef: any = await User.findByPk(arrayUsers[i].userId);

      if (!userRef) continue;

      await newTask.addUser(userRef);
    }

    // Create tags and relate them
    for (let i = 0; i < arrayTags.length; i++) {
      const newTag: any = await Tag.create({
        color: arrayTags[i].color,
        text: arrayTags[i].text,
        calendarId
      });

      await newTask.addTag(newTag);
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
        tags
      });
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
