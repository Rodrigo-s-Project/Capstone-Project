import "../styles/globals.scss";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

import { SetStateAction, Dispatch, useState, createContext } from "react";

// Components
import LandingNav from "../components/Nav/Landing/LandingNav";

// Modals
import Messages, { Message } from "../components/Modals/Messages/Messages";

// Context
export const GlobalContext = createContext<Partial<ValueAppProvider>>({});

interface ValueAppProvider {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  setArrayMsgs: Dispatch<SetStateAction<Array<Message>>>;
}

function MyApp({ Component, pageProps }: AppProps) {
  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal Msgs
  const [arrayMsgs, setArrayMsgs] = useState<Array<Message>>([]);

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        setArrayMsgs
      }}
    >
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <>
          <LandingNav />
          <Messages arrayMsgs={arrayMsgs} setArrayMsgs={setArrayMsgs} />
          <main className="main-content">
            <Component {...pageProps} />
          </main>
        </>
      </AnimatePresence>
    </GlobalContext.Provider>
  );
}

export default MyApp;
