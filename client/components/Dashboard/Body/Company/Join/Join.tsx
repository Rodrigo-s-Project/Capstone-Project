import { useContext } from "react";
import styles from "./Join.module.scss";
import stylesCard from "../CardCompany/Card.module.scss";

import { GlobalContext } from "../../../../../pages/_app";

// Icons
import PlusIcon from "../../../../Svgs/Plus";

const JoinCompany = () => {
  const { setModalPopUpJoinCompany } = useContext(GlobalContext);

  const joinToACompany = () => {
    if (setModalPopUpJoinCompany) setModalPopUpJoinCompany(true);
  };

  return (
    <div
      onClick={joinToACompany}
      title="Join to a company"
      className={stylesCard.company_grid_join}
    >
      Join to a company
      <div className={styles.company_grid_join_btn}>
        <PlusIcon />
      </div>
    </div>
  );
};

export default JoinCompany;
