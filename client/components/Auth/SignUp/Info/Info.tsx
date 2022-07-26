import styles from "./Info.module.scss";
import BtnLink from "../../../Buttons/BtnLink/BtnLink";

const Info = () => {
  return (
    <div className={styles.info}>
      <h2>Teamplace</h2>
      <p>
        Teamplace takes the best of Collaboration and CRMs softwares into one
        platform that allows companies to manage their teams and clients into
        one same working environment.
      </p>
      <BtnLink
        text="Contact Us"
        url="/"
        color="lavender-300"
        border="round_5"
        additionalClass="btn-go-contact"
      />
    </div>
  );
};

export default Info;
