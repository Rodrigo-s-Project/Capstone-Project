import PopUpModal from "../../Modals/PopUp/PopUp";
import styles from "./EditSection.module.scss";
import { useContext, useCallback, useState } from "react";
import { GlobalContext } from "../../../pages/_app";

// Hooks
import { useEditSection } from "../hooks/useEditSection";

// Components
import InputText from "../../Input/Text/InputText";
import BtnClick from "../../Buttons/BtnClick/BtnClick";

const EditSection = () => {
  const {
    controlModalState,
    setSelectedTeam,
    setSelectedCompany,
    modalPopUpEditControl,
    setModalPopUpEditControl
  } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchEdit } = useEditSection();
  const [updatedValueState, setUpdatedValueState] = useState("");

  const sendData = useCallback(() => {
    if (!controlModalState) return;

    const {
      typeEdit,
      identifier,
      teamId,
      companyId,
      isUpdateOnSingleModel
    } = controlModalState;

    fetchEdit(
      {
        typeEdit,
        identifier,
        teamId,
        companyId,
        updatedValue: updatedValueState,
        isUpdateOnSingleModel
      },
      setIsLoading,
      data => {
        if (typeEdit == "company") {
          if (setSelectedCompany) setSelectedCompany(data.newModel);
        } else {
          if (setSelectedTeam) setSelectedTeam(data.newModel);
        }

        if (setModalPopUpEditControl) setModalPopUpEditControl(false);
        setUpdatedValueState("");
      }
    );
  }, [controlModalState, updatedValueState]);

  const getTitle = (): string => {
    if (!controlModalState) return "";

    if (controlModalState.typeEdit == "company") {
      if (controlModalState.identifier == "name") return "Edit company's name";
      if (controlModalState.identifier == "username")
        return "Edit your username";
    } else {
      if (controlModalState.identifier == "name") return "Edit team's name";
      if (controlModalState.identifier == "username")
        return "Edit your username";
    }

    return "";
  };

  const getPhInput = (): string => {
    if (!controlModalState) return "";

    if (controlModalState.identifier == "name") return "New name";
    if (controlModalState.identifier == "username") return "New username";

    return "";
  };

  return (
    <PopUpModal
      isModal={modalPopUpEditControl}
      setIsModal={setModalPopUpEditControl}
    >
      {controlModalState && (
        <div className={styles.edit}>
          <div className={styles.edit_title}>{getTitle()}</div>
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
            className={styles.edit_form}
          >
            <InputText
              text={getPhInput()}
              value={updatedValueState}
              setValue={setUpdatedValueState}
              id="input-modal-edit-control"
              type="text"
            />
            <BtnClick
              text="Update"
              callback={sendData}
              color="lavender-300"
              border="round_5"
              isLoading={isLoading}
            />
          </form>
        </div>
      )}
    </PopUpModal>
  );
};

export default EditSection;
