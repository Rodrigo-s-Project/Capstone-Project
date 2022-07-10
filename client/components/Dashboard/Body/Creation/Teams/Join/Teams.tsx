import styles from "../../Creation.module.scss";
import BtnSpinner from "../../../../../Buttons/BtnClick/BtnClick";
import { GlobalContext } from "../../../../../../pages/_app";
import { useContext, useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import TeamCard from "./Card/TeamCard";
import JoinTeam from "./JoinTeam/JoinTeam";

// Routes
import {
  getCompanyEndpoint,
  DATA_GET_COMPANY
} from "../../../../../../routes/dashboard.company.routes";
import {
  getTeamsEndpoint,
  DATA_GET_TEAMS,
  TEAM
} from "../../../../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../../../../routes/index.routes";

const TeamComponent = () => {
  const {
    setArrayMsgs,
    setModalPopUpCreateTeam,
    refetchTeams,
    teams,
    setSelectedCompany,
    selectedCompany,
    user,
    setTeams
  } = useContext(GlobalContext);

  const router = useRouter();
  const { id } = router.query;

  const createATeam = () => {
    if (setModalPopUpCreateTeam) {
      setModalPopUpCreateTeam(true);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  // TODO: loader

  const getAllTeams = useCallback(
    async (companyId: number) => {
      try {
        setIsLoading(true);
        const response = await axios.get(getTeamsEndpoint.url(companyId), {
          withCredentials: true
        });
        setIsLoading(false);

        const data: RESPONSE = response.data;
        const companiesData: DATA_GET_TEAMS = data.data;
        if (setTeams) {
          setTeams(companiesData.teams);
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
    },
    [setArrayMsgs, setTeams]
  );

  useEffect(() => {
    if (selectedCompany) {
      getAllTeams(selectedCompany.id);
    }
  }, [refetchTeams, getAllTeams, selectedCompany]);

  const getCompanyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getCompanyEndpoint.url(id), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const companyData: DATA_GET_COMPANY = data.data;

      if (!companyData) {
        router.replace("/");
        return;
      }

      if (!companyData.company) {
        router.replace("/");
        return;
      }

      if (!companyData.company.id) {
        router.replace("/");
        return;
      }

      if (setSelectedCompany) {
        setSelectedCompany(companyData.company);
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
      // Now get teams...
      getAllTeams(companyData.company.id);
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
      router.replace("/");
    }
  }, [setArrayMsgs, setSelectedCompany, getAllTeams, id, router]);

  useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  return (
    <div className={styles.creation}>
      <div className={styles.creation_top}>
        <h1>Teams</h1>
        {selectedCompany && user && selectedCompany.adminId == user.id && (
          <BtnSpinner
            text="Create a team"
            callback={createATeam}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-add-creation"
          />
        )}
      </div>
      <div className={styles.creation_grid}>
        {teams &&
          teams.map((team: TEAM, index: number) => {
            return (
              <Fragment key={index}>
                <TeamCard team={team} />
              </Fragment>
            );
          })}
        <JoinTeam />
      </div>
    </div>
  );
};

export default TeamComponent;
