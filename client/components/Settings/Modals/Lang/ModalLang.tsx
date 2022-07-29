import styles from "./ModalLang.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { SettingsContext } from "../../Provider";
import { useContext, useState } from "react";
import InputText from "../../../Input/Text/InputText";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";

const ModalUsername = () => {
  const { modalPopUpLang, setModalPopUpLang } = useContext(SettingsContext);
  const [newLang, setNewLang] = useState<string>("");

  const newLangFunc = () => {
    localStorage.setItem("lang", newLang);
    if (setModalPopUpLang) {
      setModalPopUpLang(false);
    }
  };

  return (
    <PopUpModal isModal={modalPopUpLang} setIsModal={setModalPopUpLang}>
      <div className={styles.h1}>Edit Language preference</div>
      <div className={styles.form}>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <InputText
            text="Language"
            value={newLang}
            setValue={setNewLang}
            id="lang-settings"
            name="Language"
            type="text"
          />
          <BtnSpinner
            text="Edit Language"
            callback={newLangFunc}
            color="lavender-300"
            border="round_5"
            role="submit"
            additionalClass="btn-edit-lang-pref"
          />
        </form>
      </div>
    </PopUpModal>
  );
};

export default ModalUsername;
