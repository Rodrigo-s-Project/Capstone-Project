import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
  useEffect
} from "react";
import { CONNECTION, USER_CONNECTION } from "./messages.types";
import axios from "axios";
import {
  getAllConnections,
  DATA_GET_ALL_CONNECTIONS
} from "../../routes/chat.routes";
import { RESPONSE } from "../../routes/index.routes";

import { GlobalContext } from "../../pages/_app";

type Props = {
  children: any;
};

export const ChatContext = createContext<Partial<ChatApp>>({});

interface ChatApp {
  selectedConnection: CONNECTION | undefined;
  setSelectedConnection: Dispatch<SetStateAction<CONNECTION | undefined>>;
  arrayConnections: Array<CONNECTION>;
  setArrayConnections: Dispatch<SetStateAction<Array<CONNECTION>>>;
  arrayUsersInConnection: Array<USER_CONNECTION>;
  setArrayUsersInConnection: Dispatch<SetStateAction<Array<USER_CONNECTION>>>;
  isLoadingConnections: boolean;
  setIsLoadingConnections: Dispatch<SetStateAction<boolean>>;
}

const ProviderChat = ({ children }: Props) => {
  const { selectedCompany, selectedTeam, setArrayMsgs } = useContext(
    GlobalContext
  );

  const [isLoadingConnections, setIsLoadingConnections] = useState(false);

  const [selectedConnection, setSelectedConnection] = useState<
    CONNECTION | undefined
  >(undefined);

  const [arrayConnections, setArrayConnections] = useState<Array<CONNECTION>>(
    []
  );

  const [arrayUsersInConnection, setArrayUsersInConnection] = useState<
    Array<USER_CONNECTION>
  >([]);

  const getAllConnectionsFetch = useCallback(async () => {
    try {
      if (!selectedCompany || !selectedTeam) return;

      setIsLoadingConnections(true);
      const response = await axios.get(
        getAllConnections.url(selectedCompany.id, selectedTeam.id),
        {
          withCredentials: true
        }
      );

      setIsLoadingConnections(false);
      const data: RESPONSE = response.data;

      const dataFetch: DATA_GET_ALL_CONNECTIONS = data.data;

      if (data.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            text: data.message,
            type: data.typeMsg
          },
          ...prev
        ]);
      }

      setArrayConnections(dataFetch.connections);
    } catch (error) {
      setIsLoadingConnections(false);
      console.error(error);
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            text: "Server error",
            type: "danger"
          },
          ...prev
        ]);
      }
    }
  }, [selectedCompany, selectedTeam, setArrayMsgs]);

  useEffect(() => {
    getAllConnectionsFetch();
  }, [selectedCompany, selectedTeam, getAllConnectionsFetch]);

  return (
    <ChatContext.Provider
      value={{
        selectedConnection,
        setSelectedConnection,
        arrayConnections,
        setArrayConnections,
        arrayUsersInConnection,
        setArrayUsersInConnection,
        isLoadingConnections,
        setIsLoadingConnections
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ProviderChat;
