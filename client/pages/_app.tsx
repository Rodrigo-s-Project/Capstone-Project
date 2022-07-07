import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";

import { SetStateAction, Dispatch, useState, createContext } from "react";

// Components
import Nav from "../components/Nav/Nav";
import Loader from "../components/Loader/Spinner/Spinner";
import PopUpModal, { ModalParams } from "../components/Modals/PopUp/PopUp";

// Modals
import Messages, { Message } from "../components/Modals/Messages/Messages";

// Animations
import { fadeVariantsLongerExit } from "../animations/fade";

// Context
export const GlobalContext = createContext<Partial<ValueAppProvider>>({});
import { DATA_GET_USER } from "../routes/main.routes";

// Hooks
import { useAuth } from "../hooks/useAuth";

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
  modalPopUp: Partial<ModalParams>;
  setModalPopUp: Dispatch<SetStateAction<Partial<ModalParams>>>;

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
}

function MyApp({ Component, pageProps }: AppProps) {
  // Auth
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<DATA_GET_USER | undefined>(undefined);
  const { refetch: refetchUser, isLoading } = useAuth({ setUser, setIsAuth });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal Msgs
  const [arrayMsgs, setArrayMsgs] = useState<Array<Message>>([]);

  // Shared state Nav <---> Dashboard
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State Modal Pop up
  const [modalPopUp, setModalPopUp] = useState<Partial<ModalParams>>({});

  // State Companies
  const [companies, setCompanies] = useState<Array<COMPANY>>([]);
  const [teams, setTeams] = useState<Array<TEAM>>([]);
  const [refetchCompanies, setRefetchCompanies] = useState<boolean>(false);
  const [refetchTeams, setRefetchTeams] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<COMPANY | undefined>(
    undefined
  );
  const [selectedTeam, setSelectedTeam] = useState<TEAM | undefined>(undefined);

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
        modalPopUp,
        setModalPopUp,
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
        setSelectedTeam
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
            <PopUpModal />
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
