import styles from "./UsersRead.module.scss";
import { CSSProperties, useContext } from "react";
import { GlobalContext } from "../../../pages/_app";

// Icons
import CameraIcon from "../../Svgs/Camera";

// Routes
import { getImage } from "../../../routes/cdn.routes";

export type USER_READ = {
  username: string;
  userData: {
    email: string;
    globalUsername: string;
    id: number;
    isDarkModeOn: boolean;
    profilePictureURL: any;
    status: string;
    User_Read_Files?: {
      createdAt: Date;
    };
  };
};

type Props = {
  usersRead: Array<USER_READ>;
};

const UsersRead = ({ usersRead }: Props) => {
  const { setArrayUsersRead, setModalPopUpUsersRead } = useContext(
    GlobalContext
  );

  const openModal = () => {
    if (setArrayUsersRead && setModalPopUpUsersRead) {
      setArrayUsersRead(usersRead);
      setModalPopUpUsersRead(true);
    }
  };

  return (
    <div className={styles.reading}>
      {usersRead.slice(0, 5).map((userRedFile: any, index: number) => {
        return (
          <div
            style={
              {
                "--index-user": (index + 1) * 5
              } as CSSProperties
            }
            key={userRedFile.userData.id}
            onClick={openModal}
          >
            <CameraIcon />
            {userRedFile.userData.profilePictureURL && (
              <img
                src={`${getImage.url(userRedFile.userData.profilePictureURL)}`}
                alt={userRedFile.username}
              />
            )}
            <div extra-css="reading-user-name">
                {userRedFile.username}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersRead;
