import styles from "./Company.module.scss";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";

// Icons
import PlusIcon from "../../../Svgs/Plus";

const JoinCompany = () => {
  const joinToACompany = () => {};

  return (
    <div
      onClick={joinToACompany}
      title="Join to a company"
      className={styles.company_grid_join}
    >
      Join to a company
      <div className={styles.company_grid_join_btn}>
        <PlusIcon />
      </div>
    </div>
  );
};

const Company = () => {
  const createCompany = () => {};

  return (
    <div className={styles.company}>
      <div className={styles.company_top}>
        <h1>Companies</h1>
        <BtnSpinner
          text="Create a company"
          callback={createCompany}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-company"
        />
      </div>
      <div className={styles.company_grid}>
        <JoinCompany />
      </div>
    </div>
  );
};

export default Company;
