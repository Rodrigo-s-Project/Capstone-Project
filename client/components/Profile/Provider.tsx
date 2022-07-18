import { createContext, useState, SetStateAction, Dispatch } from "react";

export const ProfileContext = createContext<Partial<ProfileValue>>({});

interface ProfileValue {
  modalPopUpProfileUsername: boolean;
  setModalPopUpProfileUsername: Dispatch<SetStateAction<boolean>>;
  modalPopUpProfilePassword: boolean;
  setModalPopUpProfilePassword: Dispatch<SetStateAction<boolean>>;
}

type Props = {
  children: any;
};

const ProviderProfile = ({ children }: Props) => {
  const [modalPopUpProfileUsername, setModalPopUpProfileUsername] = useState<
    boolean
  >(false);
  const [modalPopUpProfilePassword, setModalPopUpProfilePassword] = useState<
    boolean
  >(false);

  return (
    <ProfileContext.Provider
      value={{
        modalPopUpProfileUsername,
        setModalPopUpProfileUsername,
        modalPopUpProfilePassword,
        setModalPopUpProfilePassword
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProviderProfile;
