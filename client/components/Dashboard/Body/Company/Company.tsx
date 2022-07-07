import styles from "./Company.module.scss";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import { GlobalContext } from "../../../../pages/_app";
import { useContext, useState } from "react";

// Icons
import PlusIcon from "../../../Svgs/Plus";

// Components
import InputText from "../../../Input/Text/InputText";
import BtnClick from "../../../Buttons/BtnClick/BtnClick";

const JoinCompanyModal = () => {
  const [code, setCode] = useState("");

  const joinCompanyFetch = () => {
    // TODO: make fetch
  };

  return (
    <div className={styles.company_join_modal}>
      <div className={styles.company_join_modal_title}>Enter Company Code</div>
      <form
        onSubmit={e => {
          e.preventDefault();
          joinCompanyFetch();
        }}
        className={styles.company_join_modal_form}
      >
        <InputText
          text="Code"
          value={code}
          setValue={setCode}
          id="input-code-join-company"
          type="text"
        />
        <BtnClick
          text="Join to a company"
          callback={() => {}}
          color="lavender-300"
          border="round_5"
        />
      </form>
    </div>
  );
};

const JoinCompany = () => {
  const { setModalPopUp } = useContext(GlobalContext);

  const joinToACompany = () => {
    if (setModalPopUp) {
      setModalPopUp({
        isModal: true,
        ref: JoinCompanyModal
      });
    }
  };

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
