import styles from "./LandingNav.module.scss";
import Link from "next/link";
import ColorSwitch from "../../Colors/Colors";
import BtnLink from "../../Buttons/BtnLink/BtnLink";
import { useState, useContext } from "react";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../animations/fade";

// Context
import { GlobalContext } from "../../../pages/_app";

type Props = {
  click?: () => any;
};

const LinksComponent = ({ click }: Props) => {
  return (
    <>
      <Link href="/">
        <a onClick={click}>HOME</a>
      </Link>
      <Link href="/#about-us" scroll={false}>
        <a onClick={click}>ABOUT US</a>
      </Link>
    </>
  );
};

const BtnsComponent = ({ click }: Props) => {
  const { isAuth } = useContext(GlobalContext);
  return (
    <>
      <ColorSwitch />
      <BtnLink
        additionalClass="log-in"
        text={isAuth ? "Dashboard" : "Log in"}
        url={isAuth ? "/dashboard" : "/log-in"}
        callback={click}
        color="lavender-200"
        border="complete_rounded"
        title={isAuth ? "Go to Dashboard" : "Go to Log In"}
      />
    </>
  );
};

const LandingNav = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <motion.nav
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.nav}
    >
      <div className={styles.nav_links}>
        <LinksComponent />
      </div>
      <div className={styles.nav_btns}>
        <BtnsComponent />
      </div>

      <div className={styles.nav_responsive_top}>
        <div className={styles.nav_responsive_top_logo}>Teamplace</div>
        <div
          onClick={() => {
            setIsNavOpen(prev => !prev);
          }}
          className={`${styles.nav_responsive_top_hamburger} ${isNavOpen &&
            styles.nav_responsive_top_hamburger_open}`}
          title="Toggle menu"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div
        className={`${styles.nav_responsive} ${isNavOpen &&
          styles.nav_responsive_open}`}
      >
        <LinksComponent click={closeNav} />
        <BtnsComponent click={closeNav} />
      </div>
    </motion.nav>
  );
};

export default LandingNav;
