import styles from "./ReadersModal.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";

import { useContext } from "react";
import { GlobalContext } from "../../../../pages/_app";

import { USER_READ } from "../../Users/UsersRead";

import CameraIcon from "../../../Svgs/Camera";
import { getImage } from "../../../../routes/cdn.routes";

const ReadersModal = () => {
  const {
    modalPopUpUsersRead,
    setModalPopUpUsersRead,
    arrayUsersRead,
    setArrayUsersRead
  } = useContext(GlobalContext);

  const clean = () => {
    if (setModalPopUpUsersRead) setModalPopUpUsersRead(false);
    if (setArrayUsersRead) setArrayUsersRead([]);
  };

  const getFormatedDate = (dateString: any): string => {
    return `${new Date(dateString).getMonth() + 1}/${new Date(
      dateString
    ).getDate()}/${new Date(dateString).getFullYear()} at ${new Date(
      dateString
    ).toLocaleString("default", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <PopUpModal
      isModal={modalPopUpUsersRead}
      setIsModal={setModalPopUpUsersRead}
      callbackClose={clean}
      extraCss={styles.card}
    >
      <div className={styles.title}>Users</div>
      <div className={styles.users}>
        {arrayUsersRead &&
          arrayUsersRead.map((user: USER_READ, index: number) => {
            return (
              <div className={styles.user} key={index}>
                <div className={styles.user_picture}>
                  <CameraIcon />
                  {user.userData.profilePictureURL && (
                    <img
                      src={`${getImage.url(user.userData.profilePictureURL)}`}
                      alt={user.username}
                    />
                  )}
                </div>
                <div className={styles.user_name}>{user.username}</div>
                <div className={styles.user_date}>
                  {getFormatedDate(
                    user.userData.User_Read_Files &&
                      user.userData.User_Read_Files.createdAt
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </PopUpModal>
  );
};

export default ReadersModal;
