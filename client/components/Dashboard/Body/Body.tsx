import styles from "./Body.module.scss";

import { useContext } from "react";

// Context
import { GlobalContext } from "../../../pages/_app";

type Props = {
  children: any;
};

const BodyDashboard = ({ children }: Props) => {
  const { isMenuOpen } = useContext(GlobalContext);

  return (
    <div
      className={`${styles.dashboard} ${isMenuOpen && styles.dashboard_open}`}
    >
      {children}
    </div>
  );
};

export default BodyDashboard;
