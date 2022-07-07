import styles from "./Body.module.scss";

import { useContext } from "react";

// Context
import { GlobalContext } from "../../../pages/_app";

const BodyDashboard = () => {
  const { isMenuOpen } = useContext(GlobalContext);

  return (
    <div
      className={`${styles.dashboard} ${isMenuOpen && styles.dashboard_open}`}
    >
      <div>Body</div>
    </div>
  );
};

export default BodyDashboard;
