import styles from "./ModalUsername.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { ProfileContext } from "../../Provider";
import { GlobalContext } from "../../../../pages/_app";
import { useContext, useState } from "react";
import InputText from "../../../Input/Text/InputText";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";

// Routes
import axios from "axios";
import { BODY_EDIT_USER, updateUser } from "../../../../routes/user.routes";
import { RESPONSE } from "../../../../routes/index.routes";

const ModalUsername = () => {
  const {
    modalPopUpProfileUsername,
    setModalPopUpProfileUsername
  } = useContext(ProfileContext);

  const { user, setArrayMsgs, refetchUser } = useContext(GlobalContext);

  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newNameFetch = async () => {
    try {
      if (!user) return;

      const body: BODY_EDIT_USER = {
        type: "username",
        value: newName,
        confirmVale: newName,
        oldvalue: user.globalUsername
      };
      setIsLoading(true);
      const reponse = await axios.put(updateUser.url, body, {
        withCredentials: true
      });
      setIsLoading(false);
      const dataResponse: RESPONSE = reponse.data;

      if (dataResponse.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: dataResponse.typeMsg,
            text: dataResponse.message
          },
          ...prev
        ]);
      }

      if (setModalPopUpProfileUsername) setModalPopUpProfileUsername(false);
      setNewName("");
      if (refetchUser) refetchUser();
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
    }
  };

  return (
    <PopUpModal
      isModal={modalPopUpProfileUsername}
      setIsModal={setModalPopUpProfileUsername}
    >
      <div className={styles.h1}>Edit Username</div>
      <div className={styles.form}>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <InputText
            text="Username"
            value={newName}
            setValue={setNewName}
            id="username-profile"
            name="Username"
            type="text"
          />
          <BtnSpinner
            text="Edit name"
            callback={newNameFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoading}
            role="submit"
            additionalClass="btn-edit-username-profile"
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default ModalUsername;
