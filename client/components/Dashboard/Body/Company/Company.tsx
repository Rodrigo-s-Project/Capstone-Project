import styles from "./Company.module.scss";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import { GlobalContext } from "../../../../pages/_app";
import { useContext, useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Icons
import PlusIcon from "../../../Svgs/Plus";

// Components
import InputText from "../../../Input/Text/InputText";
import BtnClick from "../../../Buttons/BtnClick/BtnClick";

// Icons
import Camera from "../../../Svgs/Camera";

// Routes
import {
  getCompaniesEndpoint,
  createCompanyEndpoint,
  BODY_CREATE_COMPANY,
  DATA_GET_COMPANIES,
  COMPANY,
  BODY_JOIN_COMPANY,
  joinCompanyEndpoint
} from "../../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../../routes/index.routes";

const CreateCompanyModal = () => {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [name, setName] = useState("");
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUp,
    setRefetchCompanies
  } = useContext(GlobalContext);

  const createACompanyFetch = async () => {
    try {
      setIsLoadingCreate(true);

      const body: BODY_CREATE_COMPANY = {
        name
      };

      const response = await axios.post(createCompanyEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingCreate(false);

      const data: RESPONSE = response.data;

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUp) {
          setModalPopUp(prev => ({
            ...prev,
            isModal: false
          }));
        }

        // Refetch
        if (setRefetchCompanies) {
          setRefetchCompanies(prev => !prev);
        }
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoadingCreate(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  return (
    <div className={styles.company_join_modal}>
      <div className={styles.company_join_modal_title}>Enter Company Name</div>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
        className={styles.company_join_modal_form}
      >
        <InputText
          text="Company name"
          value={name}
          setValue={setName}
          id="input-code-create-company"
          type="text"
        />
        <BtnClick
          text="Create company"
          callback={createACompanyFetch}
          color="lavender-300"
          border="round_5"
          isLoading={isLoadingCreate}
        />
      </form>
    </div>
  );
};

const JoinCompanyModal = () => {
  const [code, setCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUp,
    setRefetchCompanies
  } = useContext(GlobalContext);

  const joinCompanyFetch = async () => {
    try {
      setIsLoadingJoin(true);

      const body: BODY_JOIN_COMPANY = {
        code
      };

      const response = await axios.put(joinCompanyEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingJoin(false);

      const data: RESPONSE = response.data;

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUp) {
          setModalPopUp(prev => ({
            ...prev,
            isModal: false
          }));
        }

        // Refetch
        if (setRefetchCompanies) {
          setRefetchCompanies(prev => !prev);
        }
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoadingJoin(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  return (
    <div className={styles.company_join_modal}>
      <div className={styles.company_join_modal_title}>Enter Company Code</div>
      <form
        onSubmit={e => {
          e.preventDefault();
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
          callback={joinCompanyFetch}
          color="lavender-300"
          border="round_5"
          isLoading={isLoadingJoin}
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

type Props = {
  company: COMPANY;
};

const CompanyCard = ({ company }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.replace(`/dashboard/${company.id}`);
      }}
      title={company.name}
      className={styles.company_grid_join}
    >
      <div className={styles.company_grid_profile}>
        <Camera />
      </div>
      <div className={styles.company_grid_profile_name}>{company.name}</div>
    </div>
  );
};

const Company = () => {
  const {
    setArrayMsgs,
    setModalPopUp,
    refetchCompanies,
    setCompanies,
    companies
  } = useContext(GlobalContext);

  const createACompany = () => {
    if (setModalPopUp) {
      setModalPopUp({
        isModal: true,
        ref: CreateCompanyModal
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  // TODO: loader

  const getCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getCompaniesEndpoint.url, {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const companiesData: DATA_GET_COMPANIES = data.data;
      if (setCompanies) {
        setCompanies(companiesData.companies);
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  }, [setArrayMsgs, setCompanies]);

  useEffect(() => {
    getCompanies();
  }, [refetchCompanies, getCompanies]);

  return (
    <div className={styles.company}>
      <div className={styles.company_top}>
        <h1>Companies</h1>
        <BtnSpinner
          text="Create a company"
          callback={createACompany}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-company"
        />
      </div>
      <div className={styles.company_grid}>
        {companies &&
          companies.map((company: COMPANY, index: number) => {
            return (
              <Fragment key={index}>
                <CompanyCard company={company} />
              </Fragment>
            );
          })}
        <JoinCompany />
      </div>
    </div>
  );
};

export default Company;
