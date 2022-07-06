import styles from "./Dashboard.module.scss";

// Components
import Menu from "./Menu/Menu";
import Body from "./Body/Body";

const Dashboard = () => {
  return (
    <section className={styles.dashboard}>
      <Menu />
      <Body />
    </section>
  );
};

export default Dashboard;
