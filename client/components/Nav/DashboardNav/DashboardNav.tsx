import styles from "./DashboardNav.module.scss";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Link from "next/link";

// Context
import { GlobalContext } from "../../../pages/_app";

// Animations
import { fadeVariants } from "../../../animations/fade";

// Icons
import ChevronDown from "../../Svgs/ChevronDown";
import Bell from "../../Svgs/Bell";
import Camera from "../../Svgs/Camera";

// Components
import Cmd from "./Cmd/Cmd";
import DropDown from "./DropDown/DropDown";

const DashboardNav = () => {
  const { user } = useContext(GlobalContext);

  // State dropdown
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // Sate Open on Responsive
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <motion.nav
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.nav}
    >
      <div className={styles.nav_logo}>
        <Link href="/">
          <a>Teamplace</a>
        </Link>
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
      <div className={styles.nav_controls}>
        <div className={styles.nav_controls_cmd}>
          <Cmd />
        </div>
        <div className={styles.nav_controls_info}>
          <div className={styles.nav_controls_info_bell}>
            <Bell />
          </div>
          <div className={styles.nav_controls_info_types}>
            <div>Free</div>
          </div>
          <div className={styles.nav_controls_info_user}>
            <Link href="/profile">
              <a
                title="Go to Profile"
                className={styles.nav_controls_info_user_profile}
              >
                <div className={styles.nav_controls_info_user_profile_img}>
                  <Camera />
                </div>
                <div
                  title={user ? user.globalUsername : ""}
                  className={styles.nav_controls_info_user_profile_name}
                >
                  {user && user.globalUsername}
                </div>
              </a>
            </Link>
            <div
              title="Toggle dropdown"
              tabIndex={-1}
              onBlur={() => {
                setIsDropDownOpen(false);
              }}
              className={styles.nav_controls_info_user_drop}
              onClick={() => {
                setIsDropDownOpen(true);
              }}
            >
              <ChevronDown />
              <DropDown isOpen={isDropDownOpen} />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNav;
