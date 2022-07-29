import styles from "./Profile.module.scss";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../pages/_app";
import { ProfileContext } from "./Provider";
import { DATA_GET_USER } from "../../routes/main.routes";
import { useRouter } from "next/router";

// Routes
import {
  getImage,
  UPLOAD_IMAGE_DATA,
  deleteImage
} from "../../routes/cdn.routes";
import { BODY_EDIT_USER, updateUser } from "../../routes/user.routes";
import axios from "axios";
import { RESPONSE } from "../../routes/index.routes";

// Icons
import EditIcon from "../Svgs/Edit";
import CameraIcon from "../Svgs/Camera";

type GroupProps = {
  children: any;
  title: string;
};

export const Group = ({ children, title }: GroupProps) => {
  return (
    <div className={styles.profile_group}>
      <h2 className={styles.profile_group_h2}>{title}</h2>
      <div className={styles.profile_group_children}>{children}</div>
    </div>
  );
};

type ElementProps = {
  value: any;
  title: string;
  callback: () => any;
  show?: boolean;
};

export const Element = ({ callback, title, value, show = true }: ElementProps) => {
  return (
    <div className={styles.profile_element}>
      <div className={styles.profile_element_title}>{title}</div>
      {show && <div className={styles.profile_element_value}>{value}</div>}
      {!show && (
        <div className={styles.profile_element_notValue}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <div
        title="Edit section"
        onClick={callback}
        className={styles.profile_element_svg}
      >
        <EditIcon />
      </div>
    </div>
  );
};

type TopProps = {
  user: DATA_GET_USER;
};

const TopProfile = ({ user }: TopProps) => {
  const {
    callBackImages,
    setModalPopUpImages,
    selectedCompany,
    setArrayMsgs,
    refetchUser
  } = useContext(GlobalContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const deleteImageFetch = async () => {
    try {
      if (!selectedCompany) return;
      const fileName: string = user.profilePictureURL;

      setIsLoading(true);
      const response: any = await axios.delete(deleteImage.url(fileName), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: UPLOAD_IMAGE_DATA = response.data;

      if (!data.success) {
        if (setArrayMsgs)
          setArrayMsgs(prev => [
            {
              type: "danger",
              text: data.msg
            },
            ...prev
          ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      router.replace("/");
    }
  };

  const uploadNewImageUser = async (data: UPLOAD_IMAGE_DATA) => {
    try {
      const body: BODY_EDIT_USER = {
        type: "image",
        value: data.msg,
        confirmVale: data.msg,
        oldvalue: user.profilePictureURL
      };
      setIsLoading(true);
      const reponse = await axios.put(updateUser.url, body, {
        withCredentials: true
      });
      setIsLoading(false);
      const dataResponse: RESPONSE = reponse.data;

      if (dataResponse.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: dataResponse.typeMsg,
            text: dataResponse.message
          },
          ...prev
        ]);
      }

      if (refetchUser) refetchUser();
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      router.replace("/");
    }
  };

  const deletePrevImageUser = async () => {
    // Upload new
    callBackImages.current = async (data: UPLOAD_IMAGE_DATA) => {
      await deleteImageFetch();
      await uploadNewImageUser(data);
    };
    if (setModalPopUpImages) setModalPopUpImages(true);
  };

  return (
    <div className={styles.profile_top}>
      <div className={styles.profile_top_img}>
        <CameraIcon />
        {user.profilePictureURL && (
          <img
            src={`${getImage.url(user.profilePictureURL)}`}
            alt={user.globalUsername}
          />
        )}
        <div
          onClick={deletePrevImageUser}
          className={styles.profile_top_img_edit}
        >
          <EditIcon />
        </div>
      </div>
      <h1>Profile</h1>
    </div>
  );
};

const Profile = () => {
  const { setSelectedCompany, setSelectedTeam, user } = useContext(
    GlobalContext
  );

  useEffect(() => {
    if (setSelectedCompany) setSelectedCompany(undefined);
    if (setSelectedTeam) setSelectedTeam(undefined);
  }, [setSelectedTeam, setSelectedCompany]);

  const {
    setModalPopUpProfileUsername,
    setModalPopUpProfilePassword
  } = useContext(ProfileContext);

  const editGlobalUsername = () => {
    if (setModalPopUpProfileUsername) setModalPopUpProfileUsername(true);
  };

  const editPassword = () => {
    if (setModalPopUpProfilePassword) setModalPopUpProfilePassword(true);
  };

  return (
    <div className={styles.profile}>
      {user && (
        <>
          <TopProfile user={user} />
          <div className={styles.profile_container}>
            <Group title="Account">
              <Element
                title="Username:"
                value={user.globalUsername}
                callback={editGlobalUsername}
              />
              <Element
                title="Password:"
                value={user.globalUsername}
                callback={editPassword}
                show={false}
              />
            </Group>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
