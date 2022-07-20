import styles from "./UserAside.module.scss";
import { USER_CONNECTION } from "../../messages.types";
import { useContext, Fragment } from "react";

import { GlobalContext } from "../../../../pages/_app";
import { ChatContext } from "../../Provider";

import CameraIcon from "../../../Svgs/Camera";
import TrashAltIcon from "../../../Svgs/TrashAlt";

import { getImage } from "../../../../routes/cdn.routes";

const UserChat = ({ userRef }: { userRef: USER_CONNECTION }) => {
  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);
  const {} = useContext(ChatContext);

  const canEdit = (): boolean => {
    if (!selectedCompany) return false;
    if (userRef.company.User_Company.typeUser == "Admin") return false;
    return (
      selectedCompany.User_Company.typeUser == "Admin" ||
      selectedCompany.User_Company.typeUser == "Employee"
    );
  };

  const kickUser = async () => {
    if (setArrayMsgs) {
      // TODO: add kickUser chat
      setArrayMsgs(prev => [
        {
          type: "info",
          text: "Feature not available..."
        },
        ...prev
      ]);
    }
  };

  return (
    <div className={styles.chat_user}>
      <div className={styles.chat_user_img}>
        <CameraIcon />
        {userRef.user.profilePictureURL && (
          <img
            src={`${getImage.url(userRef.user.profilePictureURL)}`}
            alt={userRef.team.User_Team.username}
          />
        )}
      </div>
      <div className={styles.chat_user_name}>
        {userRef.team.User_Team.username}
      </div>
      {canEdit() && (
        <div
          title="Kick user from this group"
          className={styles.chat_user_delete}
          onClick={kickUser}
        >
          <TrashAltIcon />
        </div>
      )}
    </div>
  );
};

type Props = {
  typeUser: Array<string>;
  title: string;
};

const ListAside = ({ typeUser, title }: Props) => {
  const { selectedConnection } = useContext(ChatContext);
  const { user } = useContext(GlobalContext);

  const getList = () => {
    let aux: Array<USER_CONNECTION> = [];
    if (!selectedConnection || !selectedConnection.users) return [];
    if (!user) return [];

    for (let i = 0; i < selectedConnection.users.length; i++) {
      if (
        typeUser.includes(
          selectedConnection.users[i].company.User_Company.typeUser
        ) &&
        user.id != selectedConnection.users[i].user.id
      ) {
        aux.push(selectedConnection.users[i]);
      }
    }
    return aux;
  };

  return (
    <div className={styles.chat_user_group_wrapper}>
      <div className={styles.chat_user_group_title}>{title}</div>
      {getList().length == 0 && (
        <div className={styles.chat_user_array_zero}>
          <div></div>
        </div>
      )}
      {getList().length > 0 && (
        <div className={styles.chat_user_array_list}>
          {getList().map((userRef: USER_CONNECTION, index: number) => {
            return (
              <Fragment key={index}>
                <UserChat userRef={userRef} />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

const YouAreAnEmployee = () => {
  return (
    <div className={styles.chat_user_group}>
      {/* Here are the teammates */}
      <ListAside title="Teammates" typeUser={["Admin", "Employee"]} />
      {/* Here are the clients */}
      <ListAside title="Clients" typeUser={["Client"]} />
    </div>
  );
};

const YouAreAClient = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.chat_user_group}>
      {/* Here are the employees */}
      <ListAside
        title={selectedTeam ? selectedTeam.name : "Team"}
        typeUser={["Admin", "Employee"]}
      />
      {/* Here are the teammates */}
      <ListAside title="Teammates" typeUser={["Client"]} />
    </div>
  );
};

const AsideUsers = () => {
  const { selectedCompany } = useContext(GlobalContext);

  return (
    <div className={styles.chat_user_array_users}>
      {selectedCompany &&
        (selectedCompany.User_Company.typeUser == "Admin" ||
          selectedCompany.User_Company.typeUser == "Employee") && (
          <YouAreAnEmployee />
        )}
      {selectedCompany && selectedCompany.User_Company.typeUser == "Client" && (
        <YouAreAClient />
      )}
    </div>
  );
};

export default AsideUsers;
