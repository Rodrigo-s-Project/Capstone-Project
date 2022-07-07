import styles from "./Dashboard.module.scss";

// Components
import Menu from "./Menu/Menu";
import Body from "./Body/Body";

type Props = {
  children: any;
};

const DashboardWrapper = ({ children }: Props) => {
  return (
    <section className={styles.dashboard}>
      <Menu />
      <Body>{children}</Body>
    </section>
  );
};

export default DashboardWrapper;
