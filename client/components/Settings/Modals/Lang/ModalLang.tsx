import styles from "./ModalLang.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { SettingsContext } from "../../Provider";
import { useContext, useState, useCallback } from "react";
import InputText from "../../../Input/Text/InputText";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import codes from "iso-language-codes";
import { similarity } from "../../../../utils/similarity";

const PERCENTAGE = 0.4;

const ModalUsername = () => {
  const { modalPopUpLang, setModalPopUpLang } = useContext(SettingsContext);
  const [newLang, setNewLang] = useState<string>("");
  const [newLangCode, setNewLangCode] = useState<string>("");

  const getCodesArray = useCallback((): Array<any> => {
    if (newLang == "/") return codes;

    return codes
      .filter(
        (rule: any) =>
          similarity(
            rule.name.substring(0, rule.name.indexOf(",")) != ""
              ? rule.name.substring(0, rule.name.indexOf(","))
              : rule.name,
            newLang
          ) >= PERCENTAGE
      )
      .sort((a, b) => {
        if (
          similarity(
            a.name.substring(0, a.name.indexOf(",")) != ""
              ? a.name.substring(0, a.name.indexOf(","))
              : a.name,
            newLang
          ) >
          similarity(
            b.name.substring(0, b.name.indexOf(",")) != ""
              ? b.name.substring(0, b.name.indexOf(","))
              : b.name,
            newLang
          )
        ) {
          return -1;
        }
        if (
          similarity(
            a.name.substring(0, a.name.indexOf(",")) != ""
              ? a.name.substring(0, a.name.indexOf(","))
              : a.name,
            newLang
          ) <
          similarity(
            b.name.substring(0, b.name.indexOf(",")) != ""
              ? b.name.substring(0, b.name.indexOf(","))
              : b.name,
            newLang
          )
        ) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
  }, [newLang]);

  const newLangFunc = () => {
    localStorage.setItem("lang", newLangCode);

    if (setModalPopUpLang) {
      setModalPopUpLang(false);
    }
    setNewLang("");
    setNewLangCode("");
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
            text="Select language or /"
            value={newLang}
            setValue={setNewLang}
            id="lang-settings"
            name="Language"
            type="text"
            onChange={() => {
              setNewLangCode("");
            }}
          />
          <div
            className={`${styles.codes_container}`}
            style={{
              height:
                getCodesArray().length > 0 && newLangCode == ""
                  ? `${
                      getCodesArray().length < 4
                        ? getCodesArray().length * 40
                        : 150
                    }px`
                  : "0px"
            }}
          >
            <div className={styles.codes}>
              {newLangCode == "" &&
                getCodesArray().map((code: any, index: number) => {
                  return (
                    <div
                      onClick={() => {
                        setNewLang(code.name);
                        setNewLangCode(code.iso639_1);
                      }}
                      key={index}
                    >
                      {code.name}
                    </div>
                  );
                })}
            </div>
          </div>
          {newLangCode != "" && newLang != "" && (
            <BtnSpinner
              text="Edit Language"
              callback={newLangFunc}
              color="lavender-300"
              border="round_5"
              role="submit"
              additionalClass="btn-edit-lang-pref"
            />
          )}
        </form>
      </div>
    </PopUpModal>
  );
};

export default ModalUsername;
