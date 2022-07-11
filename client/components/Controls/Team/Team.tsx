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

// Routes
import {
  getUsersTeamEndpoint,
  DATA_GET_USER_TEAM,
  USER_TEAM
} from "../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../routes/index.routes";

const TeamSettingsController = () => {
  const { setArrayMsgs, selectedTeam, user, selectedCompany } = useContext(
    GlobalContext
  );

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
  }, [user, selectedCompany, selectedTeam]);

  return (
    <AnimatePresence>
      {!selectedTeam || !user || !selectedCompany ? null : (
        <div className={styles.control}>
          <div className={styles.control_top}>
            <div className={styles.control_top_img}>
              <CameraIcon />

              <div
                style={{
                  backgroundImage: `url(${selectedTeam.teamPictureURL})`
                }}
                className={styles.control_top_img_container}
              ></div>

              {selectedCompany.adminId == user.id && (
                <div
                  title="Change picture"
                  className={`${styles.control_top_img_edit} ${styles.control_top_img}`}
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
                    callback={() => {}}
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
