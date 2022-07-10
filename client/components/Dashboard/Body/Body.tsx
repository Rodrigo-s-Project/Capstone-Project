import styles from "./Body.module.scss";

import { useContext } from "react";

// Context
import { GlobalContext } from "../../../pages/_app";

type Props = {
  children: any;
  isMenuToggled: boolean;
};

const BodyDashboard = ({ children, isMenuToggled }: Props) => {
  const { isMenuOpen } = useContext(GlobalContext);

  return (
    <div
      className={`${styles.dashboard} ${isMenuOpen &&
        styles.dashboard_open} ${isMenuToggled && styles.menu_toggled}`}
    >
      {children}
    </div>
  );
};

export default BodyDashboard;
