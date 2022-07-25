import styles from "./Chats.module.scss";
import { useContext } from "react";
import { ChatContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";
import { CONNECTION } from "../messages.types";

// Components
import UsersAside from "./User/UserAside";

// Icons
import ChevronLeftIcon from "../../Svgs/ChevronLeft";
import EditIcon from "../../Svgs/Edit";
import PlusIcon from "../../Svgs/Plus";
import Loader from "../../Loader/Spinner/Spinner";

// Routes
import {
  emitGetMessages,
  emitGetAllConnections
} from "../../../routes/chat.routes";

const ArrayConnections = () => {
  const { arrayConnections, setSelectedConnection, socketRef } = useContext(
    ChatContext
  );

  const { selectedCompany } = useContext(GlobalContext);

  const selectChat = (connection: CONNECTION) => {
    if (setSelectedConnection && socketRef && socketRef.current) {
      socketRef.current.emit(
        emitGetMessages.method,
        ...emitGetMessages.body(connection.connection.id)
      );
      setSelectedConnection(connection);
    }
  };

  return (
    <div className={styles.connections}>
      <div className={styles.connections_title}>
        <div>Groups</div>
        {selectedCompany &&
          (selectedCompany.User_Company.typeUser == "Admin" ||
            selectedCompany.User_Company.typeUser == "Employee") && (
            <div title="Add a group" className={styles.connections_plus}>
              <PlusIcon />
            </div>
          )}
      </div>
      <div className={styles.connections_array}>
        {arrayConnections &&
          arrayConnections.map((connection: CONNECTION, index: number) => {
            return (
              <div
                title="Select chat"
                className={styles.connections_element}
                key={index}
                onClick={() => {
                  selectChat(connection);
                }}
              >
                <div>{connection.connection.name}</div>
                {connection.totalUnread > 0 && (
                  <div className={styles.connections_element_unread}>
                    {connection.totalUnread}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const TopAside = () => {
  const { selectedConnection, setSelectedConnection, socketRef } = useContext(
    ChatContext
  );
  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);

  const returnToGroups = () => {
    if (setSelectedConnection && socketRef && socketRef.current) {
      socketRef.current.emit(emitGetAllConnections);

      setSelectedConnection(undefined);
    }
  };

  const editConnection = () => {
    if (setArrayMsgs) {
      // TODO: add editConnection
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
    <>
      {selectedConnection && (
        <div className={styles.chats_connection}>
          <div className={styles.chats_connection_return}>
            <div
              onClick={returnToGroups}
              title="Return"
              className={styles.chats_connection_return_svg}
            >
              <ChevronLeftIcon />
            </div>
            <div className={styles.chats_connection_name}>
              {selectedConnection.connection.name}
            </div>
          </div>
          {selectedCompany &&
            (selectedCompany.User_Company.typeUser == "Admin" ||
              selectedCompany.User_Company.typeUser == "Employee") && (
              <div
                onClick={editConnection}
                title="Edit chat"
                className={styles.chats_connection_edit}
              >
                <EditIcon />
              </div>
            )}
        </div>
      )}
    </>
  );
};

const Chats = () => {
  const { selectedConnection, isLoadingConnections } = useContext(ChatContext);

  return (
    <div className={styles.chats}>
      {isLoadingConnections && (
        <div className={styles.loader}>
          <Loader color="lavender-300" />
        </div>
      )}

      {!isLoadingConnections && selectedConnection && (
        <>
          <TopAside />
          <UsersAside />
        </>
      )}
      {!isLoadingConnections && !selectedConnection && <ArrayConnections />}
    </div>
  );
};

export default Chats;
