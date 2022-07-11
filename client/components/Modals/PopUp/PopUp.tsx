import styles from "./PopUp.module.scss";
import { Dispatch, SetStateAction } from "react";

// Components
import TimesIcon from "../../Svgs/Times";

// Modal type
export type ModalProps = {
  isModal: boolean | undefined;
  setIsModal: Dispatch<SetStateAction<boolean>> | undefined;
  children: any;
  extraCss?: string;
  callbackClose?: () => any;
};

const PopUpModal = ({
  isModal,
  setIsModal,
  children,
  extraCss,
  callbackClose
}: ModalProps) => {
  const closeModal = () => {
    if (callbackClose) callbackClose();
    if (setIsModal) setIsModal(false);
  };

  return (
    <div className={`${isModal && styles.modal_open} ${styles.modal}`}>
      <div onClick={closeModal} className={styles.modal_back}></div>
      <div className={`${styles.modal_card} ${extraCss}`}>
        <button
          className={styles.modal_card_button}
          title="Close"
          onClick={closeModal}
        >
          <TimesIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default PopUpModal;
