import styles from "./DashboardNav.module.scss";

import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../animations/fade";

const DashboardNav = () => {
  return (
    <motion.nav
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.nav}
    >
      <div className={styles.nav_logo}>
        Teamplace
      </div>
      <div className={styles.nav_controls}>
        controls
      </div>
    </motion.nav>
  );
};

export default DashboardNav;
