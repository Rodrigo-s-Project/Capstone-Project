import "../styles/globals.scss";
import { AppProps } from "next/app";

import { SetStateAction, Dispatch, useState, createContext } from "react";

// Components
import LandingNav from "../components/Nav/Landing/LandingNav";

// Context
export const GlobalContext = createContext<Partial<ValueAppProvider>>({});

interface ValueAppProvider {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

function MyApp({ Component, pageProps }: AppProps) {
  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode
      }}
    >
      <LandingNav />
      <main>
        <Component {...pageProps} />
      </main>
    </GlobalContext.Provider>
  );
}

export default MyApp;
