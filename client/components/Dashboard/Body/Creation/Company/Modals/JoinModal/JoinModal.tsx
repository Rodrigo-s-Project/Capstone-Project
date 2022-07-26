import { useState, useContext } from "react";
import axios from "axios";
import styles from "../../../Creation.module.scss";

import { GlobalContext } from "../../../../../../../pages/_app";

// Components
import PopUpModal from "../../../../../../Modals/PopUp/PopUp";
import InputText from "../../../../../../Input/Text/InputText";
import BtnClick from "../../../../../../Buttons/BtnClick/BtnClick";

// Routes
import {
  BODY_JOIN_COMPANY,
  joinCompanyEndpoint
} from "../../../../../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../../../../../routes/index.routes";

export const JoinCompanyModal = () => {
  const [code, setCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUpJoinCompany,
    modalPopUpJoinCompany,
    setRefetchCompanies
  } = useContext(GlobalContext);

  const joinCompanyFetch = async () => {
    try {
      setIsLoadingJoin(true);

      const body: BODY_JOIN_COMPANY = {
        code
      };

      const response = await axios.put(joinCompanyEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingJoin(false);

      const data: RESPONSE = response.data;

      // Clean state
      setCode("");

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUpJoinCompany) setModalPopUpJoinCompany(false);

        // Refetch
        if (setRefetchCompanies) {
          setRefetchCompanies(prev => !prev);
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
    <PopUpModal
      isModal={modalPopUpJoinCompany}
      setIsModal={setModalPopUpJoinCompany}
    >
      <div className={styles.creation_join_modal}>
        <div className={styles.creation_join_modal_title}>
          Enter Company Code
        </div>
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
            id="input-code-join-company"
            type="text"
          />
          <BtnClick
            text="Join to a company"
            callback={joinCompanyFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoadingJoin}
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default JoinCompanyModal;
