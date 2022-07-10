import styles from "../../../../Creation.module.scss";
import { GlobalContext } from "../../../../../../../../pages/_app";
import { useContext, useState } from "react";
import axios from "axios";

// Components
import InputText from "../../../../../../../Input/Text/InputText";
import BtnClick from "../../../../../../../Buttons/BtnClick/BtnClick";

// Routes
import {
  getCompanyEndpoint,
  DATA_GET_COMPANY
} from "../../../../../../../../routes/dashboard.company.routes";
import {
  BODY_CREATE_TEAM,
  createTeamEndpoint
} from "../../../../../../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../../../../../../routes/index.routes";

// Modal Pop Up
import PopUpModal from "../../../../../../../Modals/PopUp/PopUp";

export const CreateTeamModal = () => {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [name, setName] = useState("");
  const {
    setArrayMsgs,
    refetchUser,
    modalPopUpCreateTeam,
    setModalPopUpCreateTeam,
    selectedCompany,
    setRefetchTeams
  } = useContext(GlobalContext);

  const createATeamFetch = async () => {
    try {
      setIsLoadingCreate(true);

      const body: BODY_CREATE_TEAM = {
        name,
        companyId: selectedCompany && selectedCompany.id
      };

      const response = await axios.post(createTeamEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingCreate(false);

      const data: RESPONSE = response.data;

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUpCreateTeam) setModalPopUpCreateTeam(false);

        // Refetch
        if (setRefetchTeams) {
          setRefetchTeams(prev => !prev);
        }
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
      setIsLoadingCreate(false);

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
  };

  return (
    <PopUpModal
      isModal={modalPopUpCreateTeam}
      setIsModal={setModalPopUpCreateTeam}
    >
      <div className={styles.creation_join_modal}>
        <div className={styles.creation_join_modal_title}>Enter Team Name</div>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
          className={styles.creation_join_modal_form}
        >
          <InputText
            text="Team name"
            value={name}
            setValue={setName}
            id="input-code-create-team"
            type="text"
          />
          <BtnClick
            text="Create team"
            callback={createATeamFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoadingCreate}
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default CreateTeamModal;
