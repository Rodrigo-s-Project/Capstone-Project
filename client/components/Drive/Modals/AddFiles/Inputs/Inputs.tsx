import styles from "./Inputs.module.scss";

// Icons
import CloudIcon from "../../../../Svgs/Cloud";
import ArrowIcon from "../../../../Svgs/Arrow";
import UploadCloudIcon from "../../../../Svgs/Upload";

// Components
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";

const IsNotActive = ({ onlyBtn }: { onlyBtn: boolean }) => {
  return (
    <div className={styles.notActive}>
      {onlyBtn ? null : (
        <>
          <div className={styles.notActive_svg}>
            <UploadCloudIcon />
          </div>
          <div className={styles.notActive_drop}>Drop your files here!</div>
          <div className={styles.notActive_or}>
            <div className={styles.notActive_or_hr}></div>
            <div className={styles.notActive_or_o}>O</div>
            <div className={styles.notActive_or_hr}></div>
          </div>
        </>
      )}
      <div className={styles.notActive_btn_container}>
        <BtnSpinner
          text="Browse computer"
          color="lavender-300"
          border="round_5"
          additionalClass="btn-upload-files"
        />
      </div>
    </div>
  );
};

const IsActive = () => {
  return (
    <div className={styles.notActive}>
      <div className={styles.active_svg}>
        <CloudIcon className={styles.active_svg_cloud} />
        <ArrowIcon className={styles.active_svg_arrow} />
      </div>
      <div className={styles.notActive_drop}>Drop your files here!</div>
    </div>
  );
};

type Props = {
  isActive: boolean;
  onlyBtn: boolean;
};

const InputFiles = ({ isActive, onlyBtn }: Props) => {
  return (
    <>
      {isActive && <IsActive />}
      {!isActive && <IsNotActive onlyBtn={onlyBtn} />}
    </>
  );
};
export default InputFiles;
