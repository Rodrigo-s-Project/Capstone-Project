import styles from "../../../Creation.module.scss";
import { useContext } from "react";
import { GlobalContext } from "../../../../../../../pages/_app";

// Icons
import PlusIcon from "../../../../../../Svgs/Plus";

const JoinTeam = () => {
  const { setModalPopUpJoinTeam } = useContext(GlobalContext);

  const joinToACompany = () => {
    if (setModalPopUpJoinTeam) setModalPopUpJoinTeam(true);
  };

  return (
    <div
      onClick={joinToACompany}
      title="Join to a team"
      className={styles.creation_grid_join}
    >
      Join to a team
      <div className={styles.creation_grid_join_btn}>
        <PlusIcon />
      </div>
    </div>
  );
};

export default JoinTeam;
