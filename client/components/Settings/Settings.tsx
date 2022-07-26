import styles from "./Settings.module.scss";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../pages/_app";

const Settings = () => {
  const { setSelectedCompany, setSelectedTeam } = useContext(GlobalContext);

  useEffect(() => {
    if (setSelectedCompany) setSelectedCompany(undefined);
    if (setSelectedTeam) setSelectedTeam(undefined);
  }, [setSelectedTeam, setSelectedCompany]);

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <div className={styles.settings_container}></div>
    </div>
  );
};

export default Settings;
