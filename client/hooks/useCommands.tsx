import { useContext } from "react";
import { useRouter } from "next/router";
import { RULES } from "../components/Nav/DashboardNav/Cmd/rules";
import { GlobalContext } from "../pages/_app";
import { useColorTheme } from "./useColorTheme";

interface UseCommands {
  (): {
    execCmd: (command: string) => any;
  };
}

export const useCommands: UseCommands = () => {
  const router = useRouter();
  const {
    selectedCompany,
    selectedTeam,
    setModalPopUpStripe,
    setModalPopUpCreateTeam,
    setModalPopUpJoinCompany,
    setModalPopUpJoinTeam
  } = useContext(GlobalContext);
  const { handleColorChange } = useColorTheme();

  const execCmd = (command: string) => {
    if (!RULES.includes(command)) return;

    if (command == "/goto-main") {
      router.replace("/");
    } else if (command == "/goto-profile") {
      router.replace("/dashboard/profile");
    } else if (command == "/goto-settings") {
      router.replace("/dashboard/settings");
    } else if (command == "/goto-calendar") {
      if (!selectedCompany || !selectedTeam) return;
      router.replace(
        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/calendar`
      );
    } else if (command == "/goto-drive") {
      if (!selectedCompany || !selectedTeam) return;
      router.replace(
        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/drive`
      );
    } else if (command == "/goto-chat") {
      if (!selectedCompany || !selectedTeam) return;
      router.replace(
        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/messages`
      );
    } else if (command == "/light") {
      handleColorChange("DAY");
    } else if (command == "/dark") {
      handleColorChange("NIGHT");
    } else if (command == "/create-company") {
      if (setModalPopUpStripe) setModalPopUpStripe(true);
    } else if (command == "/create-team") {
      if (setModalPopUpCreateTeam) setModalPopUpCreateTeam(true);
    } else if (command == "/join-company") {
      if (setModalPopUpJoinCompany) setModalPopUpJoinCompany(true);
    } else if (command == "/join-team") {
      if (setModalPopUpJoinTeam) setModalPopUpJoinTeam(true);
    }
  };

  return {
    execCmd
  };
};
