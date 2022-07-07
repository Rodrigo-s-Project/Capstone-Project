import { Fragment, useEffect, useContext, useState, useCallback } from "react";
import axios from "axios";
import {
  getTeamEndpoint,
  DATA_GET_TEAM
} from "../../../../routes/dashboard.team.routes";
import { RESPONSE } from "../../../../routes/index.routes";
import { GlobalContext } from "../../../../pages/_app";
import { useRouter } from "next/router";

type Props = {
  children: any;
};

const TeamWrapper = ({ children }: Props) => {
  const { setArrayMsgs, setSelectedTeam, setSelectedCompany } = useContext(
    GlobalContext
  );
  const [isLoading, setIsLoading] = useState(false);
  // TODO: loader

  const router = useRouter();
  const { idTeam } = router.query;

  const getTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getTeamEndpoint.url(idTeam), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const teamData: DATA_GET_TEAM = data.data;

      if (!teamData.company.id || !teamData.team.id) {
        router.replace("/");
        return;
      }

      if (setSelectedTeam && setSelectedCompany) {
        setSelectedCompany(teamData.company);
        setSelectedTeam(teamData.team);
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
  }, [setArrayMsgs, setSelectedCompany, setSelectedTeam, idTeam, router]);

  useEffect(() => {
    getTeam();
  }, [getTeam]);

  return <Fragment>{children}</Fragment>;
};

export default TeamWrapper;
