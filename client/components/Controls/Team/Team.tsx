import styles from "../Controls.module.scss";
import { GlobalContext } from "../../../pages/_app";
import { useContext, useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import BtnSpinner from "../../Buttons/BtnClick/BtnClick";
import axios from "axios";
import { useRouter } from "next/router";

// Icons
import CameraIcon from "../../Svgs/Camera";
import EditIcon from "../../Svgs/Edit";
import TrashAltIcon from "../../Svgs/TrashAlt";
import CopyIcon from "../../Svgs/Copy";

// Hook
import { useEditSection } from "../hooks/useEditSection";

// Routes
import {
  getUsersTeamEndpoint,
  DATA_GET_USER_TEAM,
  USER_TEAM
} from "../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../routes/index.routes";
import {
  UPLOAD_IMAGE_DATA,
  getImage,
  deleteImage
} from "../../../routes/cdn.routes";

const TeamSettingsController = () => {
  const {
    setArrayMsgs,
    selectedTeam,
    user,
    selectedCompany,
    setControlModalState,
    setModalPopUpEditControl,
    setSelectedTeam,
    callBackImages,
    setModalPopUpImages
  } = useContext(GlobalContext);

  const notAvailable = () => {
    // TODO: remove this when all finished
    if (setArrayMsgs)
      setArrayMsgs(prev => [
        {
          type: "info",
          text: "Feature not available..."
        },
        ...prev
      ]);
  };

  const copyToClipBoard = useCallback(
    (text: string) => {
      const navigatorExtendedInstance: any = navigator;
      if (!navigatorExtendedInstance) return;

      navigatorExtendedInstance.clipboard.writeText(text).then(() => {
        // Put a message
        if (setArrayMsgs)
          setArrayMsgs(prev => [
            {
              type: "success",
              text: "Copied to clipboard!"
            },
            ...prev
          ]);
      });
    },
    [setArrayMsgs]
  );

  const [isLoading, setIsLoading] = useState(false);

  const uploadNewImageTeam = async (
    data: UPLOAD_IMAGE_DATA,
    typeEdit: "company" | "team"
  ) => {
    if (!data.success || !selectedCompany || !selectedTeam) return;
    fetchEdit(
      {
        typeEdit,
        identifier: "img",
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        updatedValue: data.msg,
        isUpdateOnSingleModel: true
      },
      setIsLoading,
      data => {
        if (setSelectedTeam) setSelectedTeam(data.newModel);
      }
    );
  };

  const deleteImageFetch = async () => {
    try {
      if (!selectedCompany || !selectedTeam) return;
      const fileName: string = selectedTeam.teamPictureURL;
      if (
        fileName == "" ||
        !fileName ||
        fileName == null ||
        fileName == undefined
      ) {
        return;
      }

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

  const deletePrevImageTeam = async () => {
    // Upload new
    callBackImages.current = async (data: UPLOAD_IMAGE_DATA) => {
      await deleteImageFetch();
      await uploadNewImageTeam(data, "team");
    };
    if (setModalPopUpImages) setModalPopUpImages(true);
  };

  const [usersTeam, setUsersTeam] = useState<Array<USER_TEAM>>([]);
  // TODO: loader

  const router = useRouter();
  const { id: companyId, idTeam } = router.query;

  const getUsersFromTeam = useCallback(async () => {
    try {
      // Do fetch
      setIsLoading(true);
      const response = await axios.get(
        getUsersTeamEndpoint.url(companyId, idTeam),
        {
          withCredentials: true
        }
      );
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const companyData: DATA_GET_USER_TEAM = data.data;

      if (!companyData) {
        router.replace("/");
        return;
      }

      if (!companyData.users) {
        router.replace("/");
        return;
      }

      if (setUsersTeam) {
        setUsersTeam(companyData.users);
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
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
  }, [setArrayMsgs, companyId, router, setUsersTeam, idTeam]);

  useEffect(() => {
    if (!user || !selectedCompany || !selectedTeam) return;
    if (user.id != selectedCompany.adminId) return;
    getUsersFromTeam();
  }, [user, selectedCompany, selectedTeam, getUsersFromTeam]);

  const { fetchEdit } = useEditSection();

  return (
    <AnimatePresence>
      {!selectedTeam || !user || !selectedCompany ? null : (
        <div className={styles.control}>
          <div className={styles.control_top}>
            <div className={styles.control_top_img}>
              <CameraIcon />

              <div
                style={{
                  backgroundImage: `url(${getImage.url(
                    selectedTeam.teamPictureURL
                  )})`
                }}
                className={styles.control_top_img_container}
              ></div>

              {selectedCompany.adminId == user.id && (
                <div
                  title="Change picture"
                  className={`${styles.control_top_img_edit} ${styles.control_top_img}`}
                  onClick={deletePrevImageTeam}
                >
                  <EditIcon />
                </div>
              )}
            </div>
            <h1>{selectedTeam.name}</h1>
          </div>
          <div className={styles.control_container}>
            {selectedCompany.adminId == user.id && (
              <>
                <div className={styles.control_container_title}>Account:</div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Name of team:
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedTeam.name}
                  </div>
                  <div
                    title="Edit name of team"
                    className={styles.control_container_row_edit}
                    onClick={() => {
                      if (setModalPopUpEditControl && setControlModalState) {
                        setControlModalState({
                          typeEdit: "team",
                          identifier: "name",
                          teamId: selectedTeam.id,
                          companyId: selectedCompany.id,
                          updatedValue: "",
                          isUpdateOnSingleModel: true
                        });
                        setModalPopUpEditControl(true);
                      }
                    }}
                  >
                    <EditIcon />
                  </div>
                </div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>Code:</div>
                  <div className={styles.control_container_row_data}>
                    {selectedTeam.accessCode}
                  </div>
                  <div className={styles.control_container_row}>
                    <div
                      title="Copy code"
                      className={styles.control_container_row_copy}
                      onClick={() => {
                        copyToClipBoard(selectedTeam.accessCode);
                      }}
                    >
                      <CopyIcon />
                    </div>
                    <div
                      title="Edit code"
                      className={styles.control_container_row_edit}
                      onClick={() => {
                        fetchEdit(
                          {
                            typeEdit: "team",
                            identifier: "code",
                            teamId: selectedTeam.id,
                            companyId: selectedCompany.id,
                            updatedValue: "",
                            isUpdateOnSingleModel: true
                          },
                          setIsLoading,
                          data => {
                            if (setSelectedTeam) setSelectedTeam(data.newModel);
                          }
                        );
                      }}
                    >
                      <EditIcon />
                    </div>
                  </div>
                </div>
                <div className={styles.control_container_title}>
                  Manage users:
                </div>
                <div className={styles.control_container_users}>
                  {usersTeam.map((userCompany: USER_TEAM, index: number) => {
                    return (
                      <div
                        key={index}
                        className={styles.control_container_users_row}
                      >
                        <div className={styles.control_container_users_row_img}>
                          <div
                            className={
                              styles.control_container_users_row_img_svg
                            }
                          >
                            <CameraIcon />
                          </div>
                          {userCompany.profilePictureURL && (
                            <img
                              src={userCompany.profilePictureURL}
                              alt={userCompany.User_Team.username}
                            />
                          )}
                        </div>
                        <div
                          className={styles.control_container_users_row_name}
                          title={userCompany.User_Team.username}
                        >
                          {userCompany.User_Team.username}
                        </div>
                        {userCompany.id != user.id && (
                          <div
                            className={styles.control_container_users_row_trash}
                            onClick={notAvailable}
                          >
                            <TrashAltIcon />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div className={styles.control_container_title}>Own account:</div>
            <div className={styles.control_container_row}>
              <div className={styles.control_container_row_bold}>
                Username in team:
              </div>
              <div className={styles.control_container_row_data}>
                {selectedTeam.User_Team.username}
              </div>

              <div className={styles.control_container_row}>
                <div
                  title="Edit username"
                  className={styles.control_container_row_edit}
                  onClick={() => {
                    if (setModalPopUpEditControl && setControlModalState) {
                      setControlModalState({
                        typeEdit: "team",
                        identifier: "username",
                        teamId: selectedTeam.id,
                        companyId: selectedCompany.id,
                        updatedValue: "",
                        isUpdateOnSingleModel: false
                      });
                      setModalPopUpEditControl(true);
                    }
                  }}
                >
                  <EditIcon />
                </div>
              </div>
            </div>
            {selectedCompany.adminId == user.id && (
              <>
                <div
                  className={`${styles.control_container_title} ${styles.danger}`}
                >
                  Danger Zone:
                </div>
                <div className={styles.control_container_row}>
                  <BtnSpinner
                    text="Delete team"
                    callback={notAvailable}
                    color="danger"
                    border="round_5"
                    additionalClass="btn-delete-creation"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TeamSettingsController;
