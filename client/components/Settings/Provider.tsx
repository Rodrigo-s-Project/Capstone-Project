import { createContext, useState, SetStateAction, Dispatch } from "react";

export const SettingsContext = createContext<Partial<SettingsValue>>({});

interface SettingsValue {
  modalPopUpLang: boolean;
  setModalPopUpLang: Dispatch<SetStateAction<boolean>>;
}

type Props = {
  children: any;
};

const ProviderSettings = ({ children }: Props) => {
  const [modalPopUpLang, setModalPopUpLang] = useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        modalPopUpLang,
        setModalPopUpLang
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default ProviderSettings;
