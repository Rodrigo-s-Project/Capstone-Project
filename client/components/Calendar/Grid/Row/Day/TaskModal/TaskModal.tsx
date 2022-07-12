import styles from "./TaskModal.module.scss";
import { useContext, useCallback, useState } from "react";
import { GlobalContext } from "../../../../../../pages/_app";
import PopUpModal from "../../../../../Modals/PopUp/PopUp";
import BtnSpinner from "../../../../../Buttons/BtnClick/BtnClick";
import axios from "axios";

// Routes
import {
  createTask,
  BODY_CREATE_TASK
} from "../../../../../../routes/calendar.routes";
import { getImage } from "../../../../../../routes/cdn.routes";
import { RESPONSE } from "../../../../../../routes/index.routes";
import CameraIcon from "../../../../../Svgs/Camera";
import TimesIcon from "../../../../../Svgs/Times";

const TaskModal = () => {
  const {
    modalPopUpCreateTask,
    setModalPopUpCreateTask,
    dayClick,
    setArrayMsgs,
    selectedTeam,
    selectedCompany,
    setRefetchTasks,

    nameTask,
    descriptionTask,
    setIsLoadingTask,
    setNameTask,
    setDescriptionTask,
    usersTask,
    tagsTask,

    isLoadingTask,
    isTaskModalOnEditing,
    setIsTaskModalOnEditing,

    allTagsCalendar,
    allUsersCalendar,
    setUsersTask,
    user
  } = useContext(GlobalContext);

  const getDate = (): string => {
    if (!dayClick) return "";

    return `${dayClick.date.toLocaleString("default", {
      month: "long"
    })} ${dayClick.date.getDate()}, ${dayClick.date.getFullYear()}`;
  };

  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
  const addPeople = () => {
    setIsAddPeopleOpen(prev => !prev);
  };
  const addPersonToArray = (newId: string) => {
    if (!usersTask) return;
    if (!setUsersTask) return;

    let aux: Array<any> = [];
    let isRepeated: boolean = false;
    for (let i = 0; i < usersTask.length; i++) {
      if (usersTask[i] == newId) {
        isRepeated = true;
        continue;
      }
      aux.push(usersTask[i]);
    }

    if (!isRepeated) {
      aux.push(newId);
    }

    setUsersTask(aux);
  };

  const addTags = () => {};

  const createTaskfetch = useCallback(async () => {
    try {
      if (!dayClick || !selectedTeam || !selectedCompany) return;

      const body: BODY_CREATE_TASK = {
        name: nameTask || "",
        singleDate: true,
        fromDate: dayClick.date.getTime(),
        toDate: dayClick.date.getTime(),
        description: descriptionTask || "",
        arrayUsers: usersTask || [],
        arrayTags: tagsTask || []
      };

      if (setIsLoadingTask) setIsLoadingTask(true);

      const response = await axios.post(
        createTask.url(selectedTeam.id, selectedCompany.id),
        body,
        {
          withCredentials: true
        }
      );

      if (setIsLoadingTask) setIsLoadingTask(false);

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

      if (setModalPopUpCreateTask) setModalPopUpCreateTask(false);
      if (setNameTask) setNameTask("");
      if (setDescriptionTask) setDescriptionTask("");
      setIsAddPeopleOpen(false);

      // Refetch
      if (setRefetchTasks) setRefetchTasks(prev => !prev);
    } catch (error) {
      console.error(error);
      if (setIsLoadingTask) setIsLoadingTask(false);
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Error on creating task!"
          },
          ...prev
        ]);
      }
    }
  }, [
    dayClick,
    selectedTeam,
    selectedCompany,
    setArrayMsgs,
    nameTask,
    descriptionTask,
    setModalPopUpCreateTask,
    setRefetchTasks,
    setIsLoadingTask,
    setNameTask,
    setDescriptionTask,
    usersTask,
    tagsTask
  ]);

  const clearEverything = useCallback(() => {
    if (setNameTask) setNameTask("");
    if (setDescriptionTask) setDescriptionTask("");
    if (setIsTaskModalOnEditing) setIsTaskModalOnEditing(false);
    setIsAddPeopleOpen(false);
  }, [setNameTask, setDescriptionTask, setIsTaskModalOnEditing]);

  return (
    <PopUpModal
      isModal={modalPopUpCreateTask}
      setIsModal={setModalPopUpCreateTask}
      extraCss={styles.modal_card_task}
      callbackClose={clearEverything}
    >
      <div className={styles.task_title}>
        <input
          value={nameTask}
          onChange={e => {
            if (setNameTask) setNameTask(e.target.value);
          }}
          type="text"
          placeholder="Title"
        />
      </div>
      <div className={styles.task_date}>Date: {getDate()}</div>
      <div className={styles.task_description}>
        <div className={styles.task_description_title}>Description:</div>
        <textarea
          value={descriptionTask}
          onChange={e => {
            if (setDescriptionTask) setDescriptionTask(e.target.value);
          }}
          placeholder="description..."
          maxLength={500}
        />
      </div>
      <div className={styles.task_people}>
        <div className={styles.task_people_title}>People:</div>
        {usersTask && usersTask.length == 0 && (
          <div className={styles.task_people_no}>No one selected</div>
        )}
        {usersTask && allUsersCalendar && usersTask.length != 0 && (
          <div className={styles.task_users}>
            {allUsersCalendar.map((userRef: any, index: number) => {
              if (usersTask.includes(userRef.id)) {
                return (
                  <div className={styles.task_users_container} key={index}>
                    <div className={styles.task_users_container_img}>
                      <CameraIcon />
                      {userRef.profilePictureURL && (
                        <img
                          src={`${getImage.url(userRef.profilePictureURL)}`}
                          alt={userRef.User_Team.username}
                        />
                      )}
                    </div>
                    <div className={styles.task_users_container_name}>
                      {userRef.User_Team.username}
                    </div>
                    <div
                      onClick={() => {
                        addPersonToArray(userRef.id);
                      }}
                      className={styles.task_users_container_times}
                    >
                      <TimesIcon />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
        {isAddPeopleOpen && (
          <div className={styles.task_users}>
            {allUsersCalendar &&
              allUsersCalendar.map((userRef: any, index: number) => {
                if (user && userRef.id != user.id) {
                  return (
                    <div
                      onClick={() => {
                        addPersonToArray(userRef.id);
                      }}
                      className={styles.task_users_container}
                      key={index}
                    >
                      <div className={styles.task_users_container_img}>
                        <CameraIcon />
                        {userRef.profilePictureURL && (
                          <img
                            src={`${getImage.url(userRef.profilePictureURL)}`}
                            alt={userRef.User_Team.username}
                          />
                        )}
                      </div>
                      <div className={styles.task_users_container_name}>
                        {userRef.User_Team.username}
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        )}
        <BtnSpinner
          text={isAddPeopleOpen ? "Close" : "Add people"}
          callback={addPeople}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-people-task"
        />
      </div>
      <div className={styles.task_tag}>
        <div className={styles.task_tag_title}>Tags:</div>
        <div className={styles.task_tag_no}>No tags selected</div>
        <BtnSpinner
          text="Add tag"
          callback={addTags}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-tag"
        />
      </div>
      <div className={styles.task_create}>
        <BtnSpinner
          text={isTaskModalOnEditing ? "Edit Task" : "Create Task"}
          callback={() => {
            if (isTaskModalOnEditing) {
              // TODO: edit task endpoint
            } else {
              createTaskfetch();
            }
          }}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-created-tag"
          isLoading={isLoadingTask}
        />
      </div>
    </PopUpModal>
  );
};
export default TaskModal;
