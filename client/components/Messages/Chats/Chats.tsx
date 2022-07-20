import styles from "./Chats.module.scss";
import { useContext } from "react";
import { ChatContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";
import { CONNECTION } from "../messages.types";

// Icons
import ChevronLeftIcon from "../../Svgs/ChevronLeft";
import EditIcon from "../../Svgs/Edit";

const ArrayConnections = () => {
  const { arrayConnections, setSelectedConnection } = useContext(ChatContext);

  const selectChat = (connection: CONNECTION) => {
    if (setSelectedConnection) {
      setSelectedConnection(connection);
    }
  };

  return (
    <div className={styles.connections}>
      <div className={styles.connections_title}>Groups</div>
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
                {connection.connection.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const TopAside = () => {
  const { selectedConnection, setSelectedConnection } = useContext(ChatContext);
  const { selectedCompany } = useContext(GlobalContext);

  const returnToGroups = () => {
    if (setSelectedConnection) {
      setSelectedConnection(undefined);
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
              <div title="Edit chat" className={styles.chats_connection_edit}>
                <EditIcon />
              </div>
            )}
        </div>
      )}
    </>
  );
};

const Chats = () => {
  const { selectedConnection } = useContext(ChatContext);

  return (
    <div className={styles.chats}>
      {selectedConnection && <TopAside />}
      {!selectedConnection && <ArrayConnections />}
    </div>
  );
};

export default Chats;
