import styles from "./ModalPassword.module.scss";
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

const ModalPassword = () => {
  const {
    modalPopUpProfilePassword,
    setModalPopUpProfilePassword
  } = useContext(ProfileContext);

  const { user, setArrayMsgs, refetchUser } = useContext(GlobalContext);

  const [prevPassword, setPrevPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newPasswordFetch = async () => {
    try {
      if (!user) return;

      const body: BODY_EDIT_USER = {
        type: "password",
        value: newPassword,
        confirmVale: confirmPassword,
        oldvalue: prevPassword
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

      if (setModalPopUpProfilePassword) setModalPopUpProfilePassword(false);
      setPrevPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
      isModal={modalPopUpProfilePassword}
      setIsModal={setModalPopUpProfilePassword}
    >
      <div className={styles.h1}>Edit Password</div>
      <div className={styles.form}>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <InputText
            text="Current password"
            value={prevPassword}
            setValue={setPrevPassword}
            id="curr-password-profile"
            name="Password"
            type="password"
          />
          <InputText
            text="New password"
            value={newPassword}
            setValue={setNewPassword}
            id="new-password-profile"
            name="New password"
            type="password"
          />
          <InputText
            text="Confirm password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            id="confirm-password-profile"
            name="Confirm password"
            type="password"
          />
          <BtnSpinner
            text="Edit password"
            callback={newPasswordFetch}
            color="lavender-300"
            border="round_5"
            isLoading={isLoading}
            role="submit"
            additionalClass="btn-edit-password-profile"
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default ModalPassword;
