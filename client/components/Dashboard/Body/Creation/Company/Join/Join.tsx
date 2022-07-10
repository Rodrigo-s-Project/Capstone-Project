import { useContext } from "react";
import styles from "../../Creation.module.scss";

import { GlobalContext } from "../../../../../../pages/_app";

// Icons
import PlusIcon from "../../../../../Svgs/Plus";

const JoinCompany = () => {
  const { setModalPopUpJoinCompany } = useContext(GlobalContext);

  const joinToACompany = () => {
    if (setModalPopUpJoinCompany) setModalPopUpJoinCompany(true);
  };

  return (
    <div
      onClick={joinToACompany}
      title="Join to a company"
      className={styles.creation_grid_join}
    >
      Join to a company
      <div className={styles.creation_grid_join_btn}>
        <PlusIcon />
      </div>
    </div>
  );
};

export default JoinCompany;
