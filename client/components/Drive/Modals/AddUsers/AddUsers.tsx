import styles from "./AddUsers.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { useContext, useState, useCallback, useEffect } from "react";
import { DriveContext } from "../../Provider";
import { GlobalContext } from "../../../../pages/_app";
import axios from "axios";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";

import Loader from "../../../Loader/Spinner/Spinner";
import CameraIcon from "../../../Svgs/Camera";
import PlusIcon from "../../../Svgs/Plus";

import {
  kickUserBucket,
  BODY_KICK_ADD_USER
} from "../../../../routes/drive.routes";
import { RESPONSE } from "../../../../routes/index.routes";
import { getImage } from "../../../../routes/cdn.routes";
import {
  getUsersTeamEndpoint,
  DATA_GET_USER_TEAM,
  USER_TEAM
} from "../../../../routes/dashboard.team.routes";

const AddUsers = () => {
  const {
    modalPopUpAddUsers,
    setModalPopUpAddUsers,
    selectedBucket,
    arrayDocuments,
    fetchDocuments,
    arrayFoldersTimeLine
  } = useContext(DriveContext);
  const { setArrayMsgs, selectedCompany, selectedTeam, user } = useContext(
    GlobalContext
  );

  const [arrayUsersId, setArrayUsersId] = useState<Array<number>>([]);
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const [arrayUsers, setArrayUsers] = useState<Array<USER_TEAM>>([]);
  const [isLoadingGetUsers, setIsLoadingGetUsers] = useState(false);

  const doFetchAllUsers = async (index: number) => {
    if (index == arrayUsersId.length) {
      if (fetchDocuments && selectedBucket && arrayFoldersTimeLine) {
        fetchDocuments({
          bucket: selectedBucket,
          arrayFoldersTimeLine
        });
      }
      clean();
      return;
    }
    const res: boolean = await addUserFetch(arrayUsersId[index]);
    if (!res) return;
    setLoadingStage(prev => prev + 1);
    await doFetchAllUsers(index + 1);
  };

  const addUserFetch = async (userId: number): Promise<boolean> => {
    try {
      if (!selectedTeam || !selectedCompany || !selectedBucket) return false;

      const body: BODY_KICK_ADD_USER = {
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        userId: userId,
        bucketId: selectedBucket.id
      };

      const response = await axios.put(kickUserBucket.url, body, {
        withCredentials: true
      });

      const dataResponse: RESPONSE = response.data;
      if (dataResponse.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: dataResponse.typeMsg,
            text: dataResponse.message
          },
          ...prev
        ]);
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      return false;
    }
  };

  // Get users
  const getUsersFromTeam = useCallback(async () => {
    try {
      // Do fetch
      if (!selectedTeam || !selectedCompany) return false;

      setIsLoadingGetUsers(true);
      const response = await axios.get(
        getUsersTeamEndpoint.url(selectedCompany.id, selectedTeam.id),
        {
          withCredentials: true
        }
      );
      setIsLoadingGetUsers(false);

      const data: RESPONSE = response.data;
      const companyData: DATA_GET_USER_TEAM = data.data;

      if (!companyData) {
        setArrayUsers([]);
      }

      if (!companyData.users) {
        setArrayUsers([]);
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

      if (arrayDocuments && arrayDocuments.users && user) {
        let auxAllIds: Array<number> = [];
        for (let i = 0; i < arrayDocuments.users.length; i++) {
          if (user.id != arrayDocuments.users[i].id) {
            auxAllIds.push(arrayDocuments.users[i].id);
          }
        }

        let auxUsers: Array<USER_TEAM> = [];
        for (let i = 0; i < companyData.users.length; i++) {
          if (
            !auxAllIds.includes(companyData.users[i].id) &&
            user.id != companyData.users[i].id
          ) {
            auxUsers.push(companyData.users[i]);
          }
        }

        // All
        setArrayUsers(auxUsers);
      }
    } catch (error) {
      console.error(error);
      setIsLoadingGetUsers(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  }, [setArrayMsgs, selectedCompany, selectedTeam, arrayDocuments, user]);

  useEffect(() => {
    if (modalPopUpAddUsers) getUsersFromTeam();
  }, [modalPopUpAddUsers, getUsersFromTeam]);

  const clean = () => {
    setArrayUsersId([]);
    setLoadingStage(0);
    setArrayUsers([]);
    setIsLoadingGetUsers(false);
    if (setModalPopUpAddUsers) setModalPopUpAddUsers(false);
  };

  return (
    <PopUpModal
      extraCss={styles.card}
      isModal={modalPopUpAddUsers}
      setIsModal={setModalPopUpAddUsers}
      callbackClose={clean}
    >
      <div className={styles.title}>Add users</div>
      <div className={styles.container}>
        {isLoadingGetUsers && (
          <div className={styles.loader}>
            <Loader color="lavender-300" />
          </div>
        )}
        {!isLoadingGetUsers && (
          <>
            {arrayUsers.length == 0 && (
              <div className={styles.submit_stages}>No users to add</div>
            )}
            {arrayUsers.map((userTeam: USER_TEAM, index: number) => {
              if (user && user.id == userTeam.id) return null;
              return (
                <div
                  className={`${styles.user} ${arrayUsersId.includes(
                    userTeam.id
                  ) && styles.user_selected}`}
                  key={index}
                >
                  <div className={styles.user_picture}>
                    <CameraIcon />
                    {userTeam.profilePictureURL && (
                      <img
                        src={`${getImage.url(userTeam.profilePictureURL)}`}
                        alt={userTeam.User_Team.username}
                      />
                    )}
                  </div>
                  <div className={styles.user_name}>
                    {userTeam.User_Team.username}
                  </div>
                  <div
                    onClick={() => {
                      if (
                        arrayUsersId.includes(userTeam.id) &&
                        user &&
                        user.id != userTeam.id
                      ) {
                        // Remove
                        let aux: Array<number> = [];
                        for (let i = 0; i < arrayUsersId.length; i++) {
                          if (arrayUsersId[i] != userTeam.id) {
                            aux.push(arrayUsersId[i]);
                          }
                        }
                        setArrayUsersId(aux);
                      } else {
                        // Add
                        if (user && user.id != userTeam.id) {
                          setArrayUsersId(prev => [...prev, userTeam.id]);
                        }
                      }
                    }}
                    className={styles.user_add}
                  >
                    <PlusIcon />
                  </div>
                </div>
              );
            })}
            {arrayUsersId.length > 0 && (
              <div className={styles.submit}>
                <div className={styles.submit_stages}>
                  {loadingStage} / {arrayUsersId.length}
                </div>
                <BtnSpinner
                  text="Add users"
                  callback={() => {
                    doFetchAllUsers(0);
                  }}
                  color="lavender-300"
                  border="round_5"
                  additionalClass="btn-add-users-bucket"
                />
              </div>
            )}
          </>
        )}
      </div>
    </PopUpModal>
  );
};

export default AddUsers;
