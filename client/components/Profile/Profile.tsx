import styles from "./Profile.module.scss";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../pages/_app";

const Profile = () => {
  const { setSelectedCompany, setSelectedTeam } = useContext(GlobalContext);

  useEffect(() => {
    if (setSelectedCompany) setSelectedCompany(undefined);
    if (setSelectedTeam) setSelectedTeam(undefined);
  }, [setSelectedTeam, setSelectedCompany]);

  return (
    <div className={styles.profile}>
      <h1>Profile</h1>
      <div className={styles.profile_container}>
        
      </div>
    </div>
  );
};

export default Profile;
