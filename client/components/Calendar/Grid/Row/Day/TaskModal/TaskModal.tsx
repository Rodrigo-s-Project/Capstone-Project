import styles from "./TaskModal.module.scss";
import { useContext } from "react";
import { GlobalContext } from "../../../../../../pages/_app";
import PopUpModal from "../../../../../Modals/PopUp/PopUp";
import BtnSpinner from "../../../../../Buttons/BtnClick/BtnClick";

const TaskModal = () => {
  const {
    modalPopUpCreateTask,
    setModalPopUpCreateTask,
    dayClick
  } = useContext(GlobalContext);

  const getDate = (): string => {
    if (!dayClick) return "";

    return `${dayClick.date.toLocaleString("default", {
      month: "long"
    })} ${dayClick.date.getDate()}, ${dayClick.date.getFullYear()}`;
  };

  const addPeople = () => {};

  return (
    <PopUpModal
      isModal={modalPopUpCreateTask}
      setIsModal={setModalPopUpCreateTask}
      extraCss={styles.modal_card_task}
    >
      <div className={styles.task_title}>
        <input type="text" placeholder="Title" />
      </div>
      <div className={styles.task_date}>Date: {getDate()}</div>
      <div className={styles.task_description}>
        <div className={styles.task_description_title}>Description:</div>
        <input type="text" placeholder="description..." />
      </div>
      <div className={styles.task_people}>
        <div className={styles.task_people_title}>People:</div>
        <div className={styles.task_people_no}>No one selected</div>
        <BtnSpinner
          text="Add people"
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
          callback={addPeople}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-tag"
        />
      </div>
      <div className={styles.task_create}>
        <BtnSpinner
          text="Create Task"
          callback={addPeople}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-created-tag"
        />
      </div>
    </PopUpModal>
  );
};
export default TaskModal;