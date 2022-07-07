import styles from "./PopUp.module.scss";
import { useContext } from "react";

// Components
import TimesIcon from "../../Svgs/Times";

// Context
import { GlobalContext } from "../../../pages/_app";

// Modal type
export type ModalParams = {
  ref: any;
  isModal: boolean;
};

const PopUpModal = () => {
  const { modalPopUp, setModalPopUp } = useContext(GlobalContext);

  const closeModal = () => {
    if (setModalPopUp) {
      setModalPopUp(prev => ({
        ...prev,
        isModal: false
      }));
    }
  };

  return (
    <div
      className={`${modalPopUp && modalPopUp.isModal && styles.modal_open} ${
        styles.modal
      }`}
    >
      <div onClick={closeModal} className={styles.modal_back}></div>
      <div className={styles.modal_card}>
        <button
          className={styles.modal_card_button}
          title="Close"
          onClick={closeModal}
        >
          <TimesIcon />
        </button>
        {modalPopUp && modalPopUp.ref && <modalPopUp.ref />}
      </div>
    </div>
  );
};

export default PopUpModal;
