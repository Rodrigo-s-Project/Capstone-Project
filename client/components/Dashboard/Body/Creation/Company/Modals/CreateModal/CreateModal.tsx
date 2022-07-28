// TODO: Deprecated
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
  BODY_CREATE_COMPANY,
  createCompanyEndpoint
} from "../../../../../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../../../../../routes/index.routes";

export const CreateCompanyModal = () => {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [name, setName] = useState("");
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUpCreateCompany,
    modalPopUpCreateCompany,
    setRefetchCompanies
  } = useContext(GlobalContext);

  const createACompanyFetch = async () => {
    try {
      setIsLoadingCreate(true);

      const body: BODY_CREATE_COMPANY = {
        name
      };

      const response = await axios.post(createCompanyEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingCreate(false);

      const data: RESPONSE = response.data;

      // Clean state
      setName("");

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUpCreateCompany) setModalPopUpCreateCompany(false);

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
      isModal={modalPopUpCreateCompany}
      setIsModal={setModalPopUpCreateCompany}
    >
      <div className={styles.creation_join_modal}>
        <div className={styles.creation_join_modal_title}>
          Enter Company Name
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
          className={styles.creation_join_modal_form}
        >
          <InputText
            text="Company name"
            value={name}
            setValue={setName}
            id="input-code-create-company"
            type="text"
          />
          <BtnClick
            text="Create company"
            callback={createACompanyFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoadingCreate}
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default CreateCompanyModal;
