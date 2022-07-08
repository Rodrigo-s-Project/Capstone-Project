import styles from "./Teams.module.scss";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";
import { GlobalContext } from "../../../../../pages/_app";
import { useContext, useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Icons
import PlusIcon from "../../../../Svgs/Plus";

// Components
import InputText from "../../../../Input/Text/InputText";
import BtnClick from "../../../../Buttons/BtnClick/BtnClick";

// Icons
import Camera from "../../../../Svgs/Camera";

// Routes
import {
  getCompanyEndpoint,
  DATA_GET_COMPANY
} from "../../../../../routes/dashboard.company.routes";
import {
  getTeamsEndpoint,
  DATA_GET_TEAMS,
  TEAM,
  joinTeamEndpoint,
  BODY_JOIN_TEAM,
  BODY_CREATE_TEAM,
  createTeamEndpoint
} from "../../../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../../../routes/index.routes";

const CreateTeamModal = () => {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [name, setName] = useState("");
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUp,
    selectedCompany,
    setRefetchTeams
  } = useContext(GlobalContext);

  const createATeamFetch = async () => {
    try {
      setIsLoadingCreate(true);

      const body: BODY_CREATE_TEAM = {
        name,
        companyId: selectedCompany && selectedCompany.id
      };

      const response = await axios.post(createTeamEndpoint.url, body, {
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
        if (setRefetchTeams) {
          setRefetchTeams(prev => !prev);
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
    <div className={styles.team_join_modal}>
      <div className={styles.team_join_modal_title}>Enter Team Name</div>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
        className={styles.team_join_modal_form}
      >
        <InputText
          text="Team name"
          value={name}
          setValue={setName}
          id="input-code-create-team"
          type="text"
        />
        <BtnClick
          text="Create team"
          callback={createATeamFetch}
          color="lavender-300"
          border="round_5"
          isLoading={isLoadingCreate}
        />
      </form>
    </div>
  );
};

const JoinTeamModal = () => {
  const [code, setCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const {
    setArrayMsgs,
    refetchUser,
    setModalPopUp,
    selectedCompany,
    setRefetchTeams
  } = useContext(GlobalContext);

  const joinTeamFetch = async () => {
    try {
      setIsLoadingJoin(true);

      const body: BODY_JOIN_TEAM = {
        code,
        companyId: selectedCompany && selectedCompany.id
      };

      const response = await axios.put(joinTeamEndpoint.url, body, {
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
        if (setRefetchTeams) {
          setRefetchTeams(prev => !prev);
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
    <div className={styles.team_join_modal}>
      <div className={styles.team_join_modal_title}>Enter Team Code</div>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
        className={styles.team_join_modal_form}
      >
        <InputText
          text="Code"
          value={code}
          setValue={setCode}
          id="input-code-join-team"
          type="text"
        />
        <BtnClick
          text="Join to a team"
          callback={joinTeamFetch}
          color="lavender-300"
          border="round_5"
          isLoading={isLoadingJoin}
        />
      </form>
    </div>
  );
};

const JoinTeam = () => {
  const { setModalPopUp } = useContext(GlobalContext);

  const joinToACompany = () => {
    if (setModalPopUp) {
      setModalPopUp({
        isModal: true,
        ref: JoinTeamModal
      });
    }
  };

  return (
    <div
      onClick={joinToACompany}
      title="Join to a team"
      className={styles.team_grid_join}
    >
      Join to a team
      <div className={styles.team_grid_join_btn}>
        <PlusIcon />
      </div>
    </div>
  );
};

type Props = {
  team: TEAM;
};

const TeamCard = ({ team }: Props) => {
  const router = useRouter();
  const { selectedCompany } = useContext(GlobalContext);

  return (
    <div
      onClick={() => {
        router.replace(
          `/dashboard/${selectedCompany && selectedCompany.id}/team/${team.id}`
        );
      }}
      title={team.name}
      className={styles.team_grid_join}
    >
      <div className={styles.team_grid_profile}>
        <Camera />
      </div>
      <div className={styles.team_grid_profile_name}>{team.name}</div>
    </div>
  );
};

const Company = () => {
  const {
    setArrayMsgs,
    setModalPopUp,
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
    if (setModalPopUp) {
      setModalPopUp({
        isModal: true,
        ref: CreateTeamModal
      });
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
    <div className={styles.team}>
      <div className={styles.team_top}>
        <h1>Teams</h1>
        {selectedCompany && user && selectedCompany.adminId == user.id && (
          <BtnSpinner
            text="Create a team"
            callback={createATeam}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-add-team"
          />
        )}
      </div>
      <div className={styles.team_grid}>
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

export default Company;
