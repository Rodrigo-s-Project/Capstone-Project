import styles from "./CreateConnection.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { useContext, useState } from "react";
import { ChatContext } from "../../Provider";
import { GlobalContext } from "../../../../pages/_app";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import InputText from "../../../Input/Text/InputText";
import axios from "axios";

import {
  createConnection as createConnectionEndpoint,
  BODY_CREATE_CONNECTION
} from "../../../../routes/chat.routes";

import { RESPONSE } from "../../../../routes/index.routes";

const CreateConnectionModal = () => {
  const {
    modalCreateConnection,
    setModalCreateConnection,
    setRefetchConnections
  } = useContext(ChatContext);
  const { setArrayMsgs, selectedCompany, selectedTeam } = useContext(
    GlobalContext
  );

  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createConnection = async () => {
    try {
      if (!selectedCompany || !selectedTeam) return;

      setIsLoading(true);
      const body: BODY_CREATE_CONNECTION = {
        name: newName,
        teamId: selectedTeam.id,
        companyId: selectedCompany.id
      };

      const response = await axios.post(createConnectionEndpoint.url, body, {
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
    if (setModalCreateConnection) setModalCreateConnection(false);
    setNewName("");
  };

  return (
    <PopUpModal
      isModal={modalCreateConnection}
      setIsModal={setModalCreateConnection}
      callbackClose={clean}
    >
      <div className={styles.title}>Add Group</div>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
        className={styles.form}
      >
        <InputText
          text="Name of new group"
          value={newName}
          setValue={setNewName}
          id="name-group-input"
          name="name-group"
          type="text"
        />
        <BtnSpinner
          text="Create"
          callback={createConnection}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-group"
          isLoading={isLoading}
          role="submit"
        />
      </form>
    </PopUpModal>
  );
};
export default CreateConnectionModal;
