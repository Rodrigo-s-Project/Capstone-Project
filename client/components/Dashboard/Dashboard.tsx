import styles from "./Dashboard.module.scss";
import { useContext } from "react";

// Icons
import AnglesLeftIcon from "../Svgs/AnglesLeft";

// Context
import { GlobalContext } from "../../pages/_app";

// Components
import Menu from "./Menu/Menu";
import Body from "./Body/Body";
import { useState } from "react";

type Props = {
  children: any;
};

const DashboardWrapper = ({ children }: Props) => {
  const { isMenuToggled, setIsMenuToggled } = useContext(GlobalContext);

  const [isMenuToggleVisible, setIsMenuToggleVisible] = useState<boolean>(
    false
  );

  return (
    <section className={styles.dashboard}>
      <Menu
        setIsMenuToggleVisible={setIsMenuToggleVisible}
        isMenuToggled={isMenuToggled || false}
      />
      <div
        onClick={() => {
          if (setIsMenuToggled) setIsMenuToggled(prev => !prev);
        }}
        title="Toggle menu"
        className={`${styles.menu_toggle} ${isMenuToggleVisible &&
          styles.menu_toggle_visible} ${isMenuToggled &&
          styles.menu_toggle_open}`}
      >
        <AnglesLeftIcon />
      </div>
      <Body isMenuToggled={isMenuToggled || false}>{children}</Body>
    </section>
  );
};

export default DashboardWrapper;
