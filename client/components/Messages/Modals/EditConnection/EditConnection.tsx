import styles from "./EditConnection.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../Provider";
import { GlobalContext } from "../../../../pages/_app";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import InputText from "../../../Input/Text/InputText";
import axios from "axios";

import {
  editConnection as editConnectionEndpoint,
  BODY_EDIT_CONNECTION,
  deleteConnection as deleteConnectionEndpoint,
  BODY_DELETE_CONNECTION
} from "../../../../routes/chat.routes";

import { RESPONSE } from "../../../../routes/index.routes";

const EditConnectionModal = () => {
  const {
    modalEditConnection,
    setModalEditConnection,
    setRefetchConnections,
    selectedConnection,
    setSelectedConnection
  } = useContext(ChatContext);
  const { setArrayMsgs, selectedCompany, selectedTeam } = useContext(
    GlobalContext
  );

  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (selectedConnection) {
      setNewName(selectedConnection.connection.name);
    }
  }, [selectedConnection, modalEditConnection]);

  const editConnection = async () => {
    try {
      if (!selectedCompany || !selectedTeam || !selectedConnection) return;

      setIsLoading(true);
      const body: BODY_EDIT_CONNECTION = {
        name: newName,
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        connectionId: selectedConnection.connection.id
      };

      const response = await axios.put(editConnectionEndpoint.url, body, {
        withCredentials: true
      });

      setIsLoading(false);

      const dataResponse: RESPONSE = response.data;

      if (dataResponse.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: dataResponse.typeMsg,
            text: dataResponse.message
          },
          ...prev
        ]);
      }

      // Clean
      // Refetch
      if (setSelectedConnection) {
        setSelectedConnection(undefined);
      }
      if (setRefetchConnections) setRefetchConnections(prev => !prev);
      clean();
    } catch (error) {
      console.error(error);

      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error!"
          },
          ...prev
        ]);
      }
    }
  };

  const deleteConnection = async () => {
    try {
      if (!selectedCompany || !selectedTeam || !selectedConnection) return;

      setIsLoading(true);
      const body: BODY_DELETE_CONNECTION = {
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        connectionId: selectedConnection.connection.id
      };

      const response = await axios.put(deleteConnectionEndpoint.url, body, {
        withCredentials: true
      });

      setIsLoading(false);

      const dataResponse: RESPONSE = response.data;

      if (dataResponse.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: dataResponse.typeMsg,
            text: dataResponse.message
          },
          ...prev
        ]);
      }

      // Clean
      // Refetch
      if (setSelectedConnection) {
        setSelectedConnection(undefined);
      }
      if (setRefetchConnections) setRefetchConnections(prev => !prev);
      clean();
    } catch (error) {
      console.error(error);

      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error!"
          },
          ...prev
        ]);
      }
    }
  };

  const clean = () => {
    setIsLoading(false);
    if (setModalEditConnection) setModalEditConnection(false);
    setNewName("");
  };

  return (
    <PopUpModal
      isModal={modalEditConnection}
      setIsModal={setModalEditConnection}
      callbackClose={clean}
    >
      {!isDeleting && (
        <>
          <div className={styles.title}>Edit Group</div>
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
            className={styles.form}
          >
            <InputText
              text="Group name"
              value={newName}
              setValue={setNewName}
              id="name-group-input-edit"
              name="name-group-edit"
              type="text"
            />
            <BtnSpinner
              text="Edit group"
              callback={editConnection}
              color="lavender-300"
              border="round_5"
              additionalClass="btn-edit-group"
              isLoading={isLoading}
              role="submit"
            />
            <BtnSpinner
              text="Delete group"
              callback={() => {
                setIsDeleting(true);
              }}
              color="gray"
              border="round_5"
              additionalClass="btn-edit-group"
              isLoading={isLoading}
            />
          </form>
        </>
      )}
      {isDeleting && (
        <>
          <div>Are you sure you want to delete this group?</div>
          <div className={styles.delete}>
            <BtnSpinner
              text="Delete group"
              callback={deleteConnection}
              color="lavender-300"
              border="round_5"
              additionalClass="btn-edit-group"
              isLoading={isLoading}
              role="submit"
            />
            <BtnSpinner
              text="Cancel"
              callback={() => {
                setIsDeleting(false);
              }}
              color="gray"
              border="round_5"
              additionalClass="btn-edit-group"
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </PopUpModal>
  );
};
export default EditConnectionModal;
