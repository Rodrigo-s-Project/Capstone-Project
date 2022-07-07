import styles from "./Menu.module.scss";
import stylesNav from "../../Nav/DashboardNav/DashboardNav.module.scss";
import { useContext } from "react";

// Context
import { GlobalContext } from "../../../pages/_app";

// Components
import { DashBoardNavControls } from "../../Nav/DashboardNav/DashboardNav";

const MenuDashboard = () => {
  const { isMenuOpen } = useContext(GlobalContext);

  return (
    <aside className={`${styles.menu} ${isMenuOpen && styles.menu_open}`}>
      <div className={styles.menu_nav}>
        <div className={styles.menu_nav_title}>Menu</div>
        <DashBoardNavControls
          rules={{
            ...stylesNav,
            ...styles
          }}
        />
      </div>
      <div className={styles.menu_links}>Aside</div>
    </aside>
  );
};

export default MenuDashboard;
