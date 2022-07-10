import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";

import {
  SetStateAction,
  Dispatch,
  useState,
  createContext,
  useEffect
} from "react";

// Components
import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader/Spinner/Spinner";

// Modals
import Messages, { Message } from "../components/Modals/Messages/Messages";
import {
  CreateTeamModal,
  JoinTeamModal
} from "../components/Dashboard/Body/Teams/Join/Teams";
import CreateCompanyModal from "../components/Dashboard/Body/Company/Modals/CreateModal/CreateModal";
import JoinCompanyModal from "../components/Dashboard/Body/Company/Modals/JoinModal/JoinModal";
import TaskModal from "../components/Calendar/Grid/Row/Day/TaskModal/TaskModal";

// Animations
import { fadeVariantsLongerExit } from "../animations/fade";

// Context
export const GlobalContext = createContext<Partial<ValueAppProvider>>({});
import { DATA_GET_USER } from "../routes/main.routes";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useColorTheme } from "../hooks/useColorTheme";
import { DateCalendar } from "../hooks/useDates";

// Routes
import { COMPANY } from "../routes/dashboard.company.routes";
import { TEAM } from "../routes/dashboard.team.routes";

interface ValueAppProvider {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  setArrayMsgs: Dispatch<SetStateAction<Array<Message>>>;
  user: DATA_GET_USER;
  refetchUser: (_callback?: any) => any;
  isAuth: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;

  modalPopUpCreateCompany: boolean;
  setModalPopUpCreateCompany: Dispatch<SetStateAction<boolean>>;
  modalPopUpCreateTeam: boolean;
  setModalPopUpCreateTeam: Dispatch<SetStateAction<boolean>>;
  modalPopUpJoinCompany: boolean;
  setModalPopUpJoinCompany: Dispatch<SetStateAction<boolean>>;
  modalPopUpJoinTeam: boolean;
  setModalPopUpJoinTeam: Dispatch<SetStateAction<boolean>>;
  modalPopUpCreateTask: boolean;
  setModalPopUpCreateTask: Dispatch<SetStateAction<boolean>>;

  setCompanies: Dispatch<SetStateAction<Array<COMPANY>>>;
  companies: Array<COMPANY>;
  refetchCompanies: boolean;
  setRefetchCompanies: Dispatch<SetStateAction<boolean>>;
  selectedCompany: COMPANY | undefined;
  setSelectedCompany: Dispatch<SetStateAction<COMPANY | undefined>>;

  teams: Array<TEAM>;
  setTeams: Dispatch<SetStateAction<Array<TEAM>>>;
  refetchTeams: boolean;
  setRefetchTeams: Dispatch<SetStateAction<boolean>>;
  selectedTeam: TEAM | undefined;
  setSelectedTeam: Dispatch<SetStateAction<TEAM | undefined>>;

  dayClick: DateCalendar | undefined;
  setDayClick: Dispatch<SetStateAction<DateCalendar | undefined>>;
}

function MyApp({ Component, pageProps }: AppProps) {
  // Auth
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<DATA_GET_USER | undefined>(undefined);

  const checkIfNeedToUpdateColor = (user: DATA_GET_USER) => {
    let theme: any = localStorage.getItem("theme");
    if (!theme) {
      handleColorChange(user.isDarkModeOn ? "NIGHT" : "DAY");
      if (setIsDarkMode) setIsDarkMode(user.isDarkModeOn);
    }
  };

  const { refetch: refetchUser, isLoading } = useAuth({
    setUser,
    setIsAuth,
    checkIfNeedToUpdateColor
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal Msgs
  const [arrayMsgs, setArrayMsgs] = useState<Array<Message>>([]);

  // Shared state Nav <---> Dashboard
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State Modal Pop up
  const [modalPopUpCreateCompany, setModalPopUpCreateCompany] = useState<
    boolean
  >(false);
  const [modalPopUpCreateTeam, setModalPopUpCreateTeam] = useState<boolean>(
    false
  );
  const [modalPopUpJoinCompany, setModalPopUpJoinCompany] = useState<boolean>(
    false
  );
  const [modalPopUpJoinTeam, setModalPopUpJoinTeam] = useState<boolean>(false);
  const [modalPopUpCreateTask, setModalPopUpCreateTask] = useState<boolean>(
    false
  );

  // State Companies
  const [companies, setCompanies] = useState<Array<COMPANY>>([]);
  const [teams, setTeams] = useState<Array<TEAM>>([]);
  const [refetchCompanies, setRefetchCompanies] = useState<boolean>(false);
  const [refetchTeams, setRefetchTeams] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<COMPANY | undefined>(
    undefined
  );
  const [selectedTeam, setSelectedTeam] = useState<TEAM | undefined>(undefined);

  // Update colors
  const { updateColors, handleColorChange } = useColorTheme();
  useEffect(() => {
    const newTheme: any = updateColors();
    if (setIsDarkMode) setIsDarkMode(newTheme == "NIGHT");
  }, [updateColors]);

  // Create tasks
  const [dayClick, setDayClick] = useState<DateCalendar | undefined>(undefined);

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        setArrayMsgs,
        user,
        refetchUser,
        isAuth,
        isMenuOpen,
        setIsMenuOpen,
        modalPopUpCreateCompany,
        setModalPopUpCreateCompany,
        modalPopUpCreateTeam,
        setModalPopUpCreateTeam,
        modalPopUpJoinCompany,
        setModalPopUpJoinCompany,
        modalPopUpJoinTeam,
        setModalPopUpJoinTeam,
        modalPopUpCreateTask,
        setModalPopUpCreateTask,
        companies,
        setCompanies,
        refetchCompanies,
        setRefetchCompanies,
        selectedCompany,
        setSelectedCompany,
        teams,
        setTeams,
        refetchTeams,
        setRefetchTeams,
        selectedTeam,
        setSelectedTeam,
        dayClick,
        setDayClick
      }}
    >
      <Head>
        <title>Teamplace</title>
      </Head>
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        {isLoading ? (
          <motion.div
            variants={fadeVariantsLongerExit}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="app-loader"
            key="loader-app-container"
          >
            <Loader additionalClass="loader-app" color="lavender-200" />
          </motion.div>
        ) : (
          <>
            <Nav />
            <CreateTeamModal />
            <JoinTeamModal />
            <CreateCompanyModal />
            <JoinCompanyModal />
            <TaskModal />
            <Messages arrayMsgs={arrayMsgs} setArrayMsgs={setArrayMsgs} />
            <main className="main-content">
              <Component {...pageProps} />
            </main>
          </>
        )}
      </AnimatePresence>
    </GlobalContext.Provider>
  );
}

export default MyApp;
