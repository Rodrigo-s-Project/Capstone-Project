import styles from "./Header.module.scss";
import stylesLanding from "../Landing.module.scss";
import BtnLink from "../../Buttons/BtnLink/BtnLink";
import WorkSvg from "../../Svgs/Work";

const Header = () => {
  return (
    <header className={`${styles.header} ${stylesLanding.section}`}>
      <div className={styles.header_left}>
        <h1>Teamplace</h1>
        <p>
          Teamplace takes the best of Collaboration and CRMs softwares into one
          platform that allows companies to manage their teams and clients into
          one same working environment.
        </p>
        <div className={styles.header_left_btns}>
          <BtnLink
            text="Buy Teamplace"
            url="/#pay"
            color="lavender-300"
            border="round_5"
            additionalClass="pay-header"
            title="Buy Teamplace"
          />
          <BtnLink
            text="Contact us"
            url="/#contact-us"
            color="gray"
            border="round_5"
            additionalClass="contact-us"
            title="Contact Us"
          />
        </div>
      </div>
      <div className={styles.header_img}>
        <WorkSvg />
      </div>
    </header>
  );
};

export default Header;
