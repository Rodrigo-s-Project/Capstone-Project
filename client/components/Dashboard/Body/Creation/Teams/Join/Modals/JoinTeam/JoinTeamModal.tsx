import { useState, useContext } from "react";
import { GlobalContext } from "../../../../../../../../pages/_app";
import {
  joinTeamEndpoint,
  BODY_JOIN_TEAM
} from "../../../../../../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../../../../../../routes/index.routes";
import axios from "axios";

import PopUpModal from "../../../../../../../Modals/PopUp/PopUp";
import styles from "../../../../Creation.module.scss";
import BtnClick from "../../../../../../../Buttons/BtnClick/BtnClick";
import InputText from "../../../../../../../Input/Text/InputText";

export const JoinTeamModal = () => {
  const [code, setCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const {
    setArrayMsgs,
    refetchUser,
    modalPopUpJoinTeam,
    setModalPopUpJoinTeam,
    selectedCompany,
    setRefetchTeams
  } = useContext(GlobalContext);

  const joinTeamFetch = async () => {
    try {
      setIsLoadingJoin(true);

      const body: BODY_JOIN_TEAM = {
        code,
        companyId: selectedCompany && selectedCompany.id
      };

      const response = await axios.put(joinTeamEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingJoin(false);

      const data: RESPONSE = response.data;

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUpJoinTeam) setModalPopUpJoinTeam(false);

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
      setIsLoadingJoin(false);

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
    <PopUpModal isModal={modalPopUpJoinTeam} setIsModal={setModalPopUpJoinTeam}>
      <div className={styles.creation_join_modal}>
        <div className={styles.creation_join_modal_title}>Enter Team Code</div>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
          className={styles.creation_join_modal_form}
        >
          <InputText
            text="Code"
            value={code}
            setValue={setCode}
            id="input-code-join-team"
            type="text"
          />
          <BtnClick
            text="Join to a team"
            callback={joinTeamFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoadingJoin}
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default JoinTeamModal;
