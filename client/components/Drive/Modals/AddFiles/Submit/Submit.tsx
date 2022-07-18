import styles from "./Submit.module.scss";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";

type Props = {
  show: boolean;
};

const SubmitComponent = ({ show }: Props) => {
  const uploadAllFiles = () => {};

  return (
    <>
      {show && (
        <div className={styles.submit}>
          <BtnSpinner
            text="Upload file(s)"
            callback={uploadAllFiles}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-click-upload-files"
          />
        </div>
      )}
    </>
  );
};

export default SubmitComponent;
