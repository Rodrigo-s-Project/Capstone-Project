import styles from "../Creation.module.scss";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";
import { GlobalContext } from "../../../../../pages/_app";
import { useContext, useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";

// Routes
import {
  getCompaniesEndpoint,
  DATA_GET_COMPANIES,
  COMPANY
} from "../../../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../../../routes/index.routes";

// Components
import JoinCompany from "./Join/Join";
import CompanyCard from "./CardCompany/Card";

const Company = () => {
  const {
    setArrayMsgs,
    // setModalPopUpCreateCompany,
    refetchCompanies,
    setCompanies,
    companies,
    setModalPopUpStripe
  } = useContext(GlobalContext);

  const createACompany = () => {
    // if (setModalPopUpCreateCompany) setModalPopUpCreateCompany(true);

    if (setModalPopUpStripe) setModalPopUpStripe(true);
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
    <div className={styles.creation}>
      <div className={styles.creation_top}>
        <h1>Companies</h1>
        <BtnSpinner
          text="Create a company"
          callback={createACompany}
          color="lavender-300"
          border="round_5"
          additionalClass="btn-add-creation"
        />
      </div>
      <div className={styles.creation_grid}>
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
