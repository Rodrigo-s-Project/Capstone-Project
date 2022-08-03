import styles from "./Bot.module.scss";
import Message from "./Message/Message";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  getUsersTeamEndpoint,
  DATA_GET_USER_TEAM,
  USER_TEAM
} from "../../../routes/dashboard.team.routes";
import {
  BODY_CREATE_TASK_BOT,
  createTaskBot
} from "../../../routes/calendar.routes";
import BtnSpinner from "../../Buttons/BtnClick/BtnClick";
import { RESPONSE } from "../../../routes/index.routes";
import axios from "axios";
import { GlobalContext } from "../../../pages/_app";
import { CalendarContext } from "../Provider";

const object = (text: string, id = -1) => {
  return {
    message: {
      id: Math.random(),
      text,
      mediaURL: null,
      lat: 0,
      lng: 0,
      connectionId: 9,
      createdAt: new Date(),
      ownerId: id,
      language: "en"
    },
    users: []
  };
};

const Bot = () => {
  const router = useRouter();
  const { selectedCompany, selectedTeam, setArrayMsgs, user } = useContext(
    GlobalContext
  );
  const { setRefetchTasks, month, year } = useContext(CalendarContext);
  const [isLoading, setIsLoading] = useState(false);
  const [usersTeam, setUsersTeam] = useState<Array<USER_TEAM>>([]);
  const [usersTeamSelected, setUsersTeamSelected] = useState<Array<USER_TEAM>>(
    []
  );

  const getUsersFromTeam = async () => {
    try {
      if (!selectedTeam || !selectedCompany) return;
      // Do fetch
      setIsLoading(true);
      const response = await axios.get(
        getUsersTeamEndpoint.url(selectedCompany.id, selectedTeam.id),
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
  };

  useEffect(() => {
    getUsersFromTeam();
  }, []);

  const isSelected = (userId: number) => {
    for (let i = 0; i < usersTeamSelected.length; i++) {
      if (usersTeamSelected[i].id == userId) return true;
    }

    return false;
  };

  const getArrayUsers = () => {
    let aux: Array<any> = [];

    for (let i = 0; i < usersTeamSelected.length; i++) {
      aux.push(usersTeamSelected[i].id);
    }
    return aux;
  };

  const createTask = async () => {
    try {
      if (!selectedTeam || !selectedCompany || !year || month == undefined)
        return;

      let times: Array<number> = [];
      let day = new Date().getDay();
      if (month != new Date().getMonth()) {
        // We are on a diff view
        day = 1;
      }

      let date: Date = new Date(year, month, day); // Start from this day

      while (date.getMonth() === month) {
        // Needs to be on the same month
        let thisDate: Date = new Date(date);
        times.push(thisDate.getTime());
        date.setDate(date.getDate() + 1);
      }

      const body: BODY_CREATE_TASK_BOT = {
        arrayUsers: getArrayUsers(),
        times
      };

      // Do fetch
      setIsLoading(true);
      const response = await axios.post(
        createTaskBot.url(selectedTeam.id, selectedCompany.id),
        body,
        {
          withCredentials: true
        }
      );
      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      // Refetch
      if (setRefetchTasks) setRefetchTasks(prev => !prev);
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

  return (
    <div className={styles.bot}>
      <div className={styles.bot_container}>
        <Message message={object("Hi!, welcome to the bot")} />
        <Message message={object("I can help you to schedule your meetings")} />
        <Message
          message={object(
            "Select the users that you want to join to the meeting."
          )}
        />
        <div className={styles.users}>
          Users:
          {usersTeam.map((userRef: USER_TEAM, index: number) => {
            if (user && userRef.id == user.id) return null;
            return (
              <div
                className={`${isSelected(userRef.id) && styles.selected}`}
                key={index}
                onClick={() => {
                  if (isSelected(userRef.id)) {
                    let aux: Array<USER_TEAM> = [];

                    for (let i = 0; i < usersTeamSelected.length; i++) {
                      if (usersTeamSelected[i] != userRef) {
                        aux.push(usersTeamSelected[i]);
                      }
                    }

                    setUsersTeamSelected(aux);
                  } else {
                    setUsersTeamSelected(prev => [userRef, ...prev]);
                  }
                }}
              >
                {userRef.User_Team.username}
              </div>
            );
          })}
        </div>

        {usersTeamSelected.length > 0 && (
          <>
            <Message message={object("Click on save")} />
            <BtnSpinner
              text="Save"
              callback={createTask}
              color="lavender-300"
              border="round_5"
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Bot;
