import styles from "./TaskModal.module.scss";
import { useContext, useCallback, useState } from "react";
import { GlobalContext } from "../../../../../../pages/_app";
import PopUpModal from "../../../../../Modals/PopUp/PopUp";
import BtnSpinner from "../../../../../Buttons/BtnClick/BtnClick";
import axios from "axios";

// utils
import { invertColor } from "../../../../../../utils/invertColors";

// Routes
import {
  createTask,
  BODY_CREATE_TASK,
  createTag,
  BODY_CREATE_TAG,
  editTask,
  BODY_EDIT_TASK
} from "../../../../../../routes/calendar.routes";
import { getImage } from "../../../../../../routes/cdn.routes";
import { RESPONSE } from "../../../../../../routes/index.routes";
import CameraIcon from "../../../../../Svgs/Camera";
import TimesIcon from "../../../../../Svgs/Times";
import ChevronLeftIcon from "../../../../../Svgs/ChevronLeft";

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
    user,
    setTagsTask,
    idTask,
    isSingleDateTask,
    fromTask,
    toTask,
    setIdTask,
    setIsSingleDateTask,
    setFromTask,
    setToTask
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

  const [isAddTagsopen, setIsAddTagsopen] = useState(false);
  const addTags = () => {
    setIsAddTagsopen(prev => !prev);
  };

  const [newTagTextState, setNewTagTextState] = useState("");
  const [newTagColorState, setNewTagColorState] = useState("#4542f7");

  const handleChangeTextTag = (e: any) => {
    setNewTagTextState(e.target.value);
  };

  const handleChangeColorTag = (e: any) => {
    setNewTagColorState(e.target.value);
  };

  const addTagToArray = (newId: string) => {
    if (!tagsTask) return;
    if (!setTagsTask) return;

    let aux: Array<any> = [];
    let isRepeated: boolean = false;
    for (let i = 0; i < tagsTask.length; i++) {
      if (tagsTask[i] == newId) {
        isRepeated = true;
        continue;
      }
      aux.push(tagsTask[i]);
    }

    if (!isRepeated) {
      aux.push(newId);
    }

    setTagsTask(aux);
  };

  const createTagFetch = async () => {
    try {
      if (!dayClick || !selectedTeam || !selectedCompany) return;

      const body: BODY_CREATE_TAG = {
        text: newTagTextState,
        color: newTagColorState
      };

      if (setIsLoadingTask) setIsLoadingTask(true);

      const response = await axios.post(
        createTag.url(selectedTeam.id, selectedCompany.id),
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

      setNewTagTextState("");
      setNewTagColorState("#4542f7");
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
  };

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
      if (setTagsTask) setTagsTask([]);
      if (setUsersTask) setUsersTask([]);
      if (setIdTask) setIdTask(0);
      if (setIsSingleDateTask) setIsSingleDateTask(false);
      if (setFromTask) setFromTask(0);
      if (setToTask) setToTask(0);
      setNewTagTextState("");
      setNewTagColorState("#4542f7");
      setIsAddPeopleOpen(false);
      setIsAddTagsopen(false);

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
    tagsTask,
    setTagsTask,
    setUsersTask,
    setIdTask,
    setIsSingleDateTask,
    setFromTask,
    setToTask
  ]);

  const editTaskFetch = useCallback(async () => {
    try {
      if (
        !dayClick ||
        !selectedTeam ||
        !selectedCompany ||
        !idTask ||
        !fromTask
      )
        return;

      const body: BODY_EDIT_TASK = {
        name: nameTask || "",
        singleDate: isSingleDateTask,
        fromDate: fromTask,
        toDate: toTask,
        description: descriptionTask || "",
        arrayUsers: usersTask || [],
        arrayTags: tagsTask || []
      };

      if (setIsLoadingTask) setIsLoadingTask(true);

      const response = await axios.put(
        editTask.url(selectedTeam.id, selectedCompany.id, idTask),
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
      if (setTagsTask) setTagsTask([]);
      if (setUsersTask) setUsersTask([]);
      if (setIdTask) setIdTask(0);
      if (setIsSingleDateTask) setIsSingleDateTask(false);
      if (setFromTask) setFromTask(0);
      if (setToTask) setToTask(0);
      setNewTagTextState("");
      setNewTagColorState("#4542f7");
      setIsAddPeopleOpen(false);
      setIsAddTagsopen(false);

      // Refetch
      if (setRefetchTasks) setRefetchTasks(prev => !prev);
    } catch (error) {
      console.error(error);
      if (setIsLoadingTask) setIsLoadingTask(false);
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
    tagsTask,
    setTagsTask,
    setUsersTask,
    idTask,
    setIdTask,
    setIsSingleDateTask,
    setFromTask,
    setToTask,
    fromTask,
    isSingleDateTask,
    toTask
  ]);

  const clearEverything = useCallback(() => {
    if (setNameTask) setNameTask("");
    if (setDescriptionTask) setDescriptionTask("");
    if (setIsTaskModalOnEditing) setIsTaskModalOnEditing(false);
    if (setTagsTask) setTagsTask([]);
    if (setUsersTask) setUsersTask([]);
    if (setIdTask) setIdTask(0);
    if (setIsSingleDateTask) setIsSingleDateTask(false);
    if (setFromTask) setFromTask(0);
    if (setToTask) setToTask(0);
    setIsAddPeopleOpen(false);
    setIsAddTagsopen(false);
    setNewTagTextState("");
    setNewTagColorState("#4542f7");
  }, [
    setNameTask,
    setDescriptionTask,
    setIsTaskModalOnEditing,
    setTagsTask,
    setUsersTask,
    setFromTask,
    setIdTask,
    setIsSingleDateTask,
    setToTask
  ]);

  return (
    <PopUpModal
      isModal={modalPopUpCreateTask}
      setIsModal={setModalPopUpCreateTask}
      extraCss={styles.modal_card_task}
      callbackClose={clearEverything}
    >
      {!isAddTagsopen && (
        <>
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
                                src={`${getImage.url(
                                  userRef.profilePictureURL
                                )}`}
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

            {tagsTask && tagsTask.length > 0 && (
              <div className={styles.wrap_tags}>
                {allTagsCalendar &&
                  allTagsCalendar.map((tagRef: any, index: number) => {
                    if (tagsTask && tagsTask.includes(tagRef.id)) {
                      return (
                        <div
                          style={{
                            backgroundColor: tagRef.color,
                            color: invertColor(tagRef.color, true)
                          }}
                          className={styles.tags_container_tag}
                          key={index}
                        >
                          {tagRef.text}
                        </div>
                      );
                    }
                  })}
              </div>
            )}

            {tagsTask && tagsTask.length == 0 && (
              <div className={styles.task_tag_no}>No tags selected</div>
            )}

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
                  editTaskFetch();
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
        </>
      )}
      {isAddTagsopen && (
        <>
          <div className={styles.tags_title} onClick={addTags}>
            <ChevronLeftIcon />
            Save and return
          </div>
          <div className={styles.wrapper}>
            <div className={styles.tags_subtitle}>Selected tags:</div>
            <div className={styles.tags_container}>
              {/* Pool for selected tags */}
              {allTagsCalendar &&
                allTagsCalendar.map((tagRef: any, index: number) => {
                  if (tagsTask && tagsTask.includes(tagRef.id)) {
                    return (
                      <div
                        onClick={() => {
                          addTagToArray(tagRef.id);
                        }}
                        style={{
                          backgroundColor: tagRef.color,
                          color: invertColor(tagRef.color, true)
                        }}
                        className={styles.tags_container_tag}
                        key={index}
                      >
                        {tagRef.text}
                      </div>
                    );
                  }
                })}
              {tagsTask && tagsTask.length == 0 && (
                <div className={styles.no}>No tags selected</div>
              )}
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.tags_subtitle}>All tags:</div>
            <div className={styles.tags_container}>
              {/* Pool for created tags */}
              {allTagsCalendar &&
                allTagsCalendar.map((tagRef: any, index: number) => {
                  return (
                    <div
                      style={{
                        backgroundColor: tagRef.color,
                        color: invertColor(tagRef.color, true)
                      }}
                      className={styles.tags_container_tag}
                      key={index}
                      onClick={() => {
                        addTagToArray(tagRef.id);
                      }}
                    >
                      {tagRef.text}
                    </div>
                  );
                })}
              {allTagsCalendar && allTagsCalendar.length == 0 && (
                <div className={styles.no}>No tags</div>
              )}
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.tags_subtitle}>Create a tag:</div>
            <div className={styles.tags_create}>
              <form
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <div className={styles.tags_create_inputs}>
                  <input
                    type="text"
                    onChange={handleChangeTextTag}
                    value={newTagTextState}
                    placeholder="Text of tag"
                    maxLength={15}
                  />
                  <input
                    type="color"
                    onChange={handleChangeColorTag}
                    value={newTagColorState}
                  />
                </div>
                {newTagTextState != "" && (
                  <div className={styles.tags_create_prev}>
                    <div className={styles.tags_create_prev_title}>
                      Previsualization of the tag:
                    </div>
                    <div
                      className={styles.tags_create_prev_tag}
                      style={{
                        backgroundColor: newTagColorState,
                        color: invertColor(newTagColorState, true)
                      }}
                    >
                      {newTagTextState}
                    </div>
                  </div>
                )}
                <BtnSpinner
                  text="Create new tag"
                  callback={createTagFetch}
                  color="lavender-300"
                  border="round_5"
                  additionalClass="btn-add-tag-task"
                  isLoading={isLoadingTask}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </PopUpModal>
  );
};
export default TaskModal;
