import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
  useEffect,
  useRef
} from "react";
import { CONNECTION, USER_CONNECTION, MESSAGE } from "./messages.types";
import axios from "axios";
import { useRouter } from "next/router";
import {
  emitHandshake,
  getTicketEndpoint,
  DATA_GET_TICKET,
  onAccept,
  onReject,
  emitGetAllConnections,
  DATA_GET_ALL_CONNECTIONS,
  onGetAllConnections
} from "../../routes/chat.routes";
import { RESPONSE } from "../../routes/index.routes";

import { GlobalContext } from "../../pages/_app";

// Sockets
import io from "socket.io-client";

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
  isLoadingBody: boolean;
  setIsLoadingBody: Dispatch<SetStateAction<boolean>>;
  socketRef: any;
  ticketRef: any;

  arrayMessages: Array<MESSAGE>;
  setArrayMessages: Dispatch<SetStateAction<Array<MESSAGE>>>;

  modalCreateConnection: boolean;
  setModalCreateConnection: Dispatch<SetStateAction<boolean>>;
  refetchConnections: boolean;
  setRefetchConnections: Dispatch<SetStateAction<boolean>>;
  modalEditConnection: boolean;
  setModalEditConnection: Dispatch<SetStateAction<boolean>>;
}

const ProviderChat = ({ children }: Props) => {
  const { selectedCompany, selectedTeam, setArrayMsgs } = useContext(
    GlobalContext
  );

  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [isLoadingBody, setIsLoadingBody] = useState(false);
  const [modalCreateConnection, setModalCreateConnection] = useState(false);
  const [modalEditConnection, setModalEditConnection] = useState(false);
  const [refetchConnections, setRefetchConnections] = useState(false);

  const [selectedConnection, setSelectedConnection] = useState<
    CONNECTION | undefined
  >(undefined);

  const [arrayConnections, setArrayConnections] = useState<Array<CONNECTION>>(
    []
  );

  const [arrayMessages, setArrayMessages] = useState<Array<MESSAGE>>([]);

  const [arrayUsersInConnection, setArrayUsersInConnection] = useState<
    Array<USER_CONNECTION>
  >([]);

  const ticketRef = useRef<any>(null);

  const getTicketToStablishConnection = useCallback(async () => {
    try {
      if (!selectedCompany || !selectedTeam) return;

      setIsLoadingConnections(true);
      const response = await axios.get(getTicketEndpoint.url, {
        withCredentials: true
      });

      setIsLoadingConnections(false);
      const data: RESPONSE = response.data;

      const dataFetch: DATA_GET_TICKET = data.data;

      if (data.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            text: data.message,
            type: data.typeMsg
          },
          ...prev
        ]);
      }

      ticketRef.current = dataFetch.tokenForSockets;
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
    getTicketToStablishConnection();
  }, [selectedCompany, selectedTeam, getTicketToStablishConnection]);

  // Sockets
  const socketRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Connect
    socketRef.current = io(process.env.API_URL || "");

    // Make handshake
    if (
      !selectedCompany ||
      !selectedTeam ||
      !ticketRef.current ||
      !router.pathname.includes("/messages")
    )
      return;

    socketRef.current.emit(
      emitHandshake.method,
      ...emitHandshake.body(
        ticketRef.current,
        selectedCompany.id,
        selectedTeam.id
      )
    );

    socketRef.current.on(onAccept, () => {
      socketRef.current.emit(emitGetAllConnections);

      socketRef.current.on(
        onGetAllConnections,
        (dataOnGetAllConnections: DATA_GET_ALL_CONNECTIONS) => {
          setArrayConnections(dataOnGetAllConnections.connections);
        }
      );
    });

    socketRef.current.on(onReject, () => {
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            text: "Error connecting to sockets",
            type: "danger"
          },
          ...prev
        ]);
    });
  }, [selectedCompany, selectedTeam, router, setArrayMsgs, refetchConnections]);

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
        setIsLoadingConnections,
        isLoadingBody,
        setIsLoadingBody,
        socketRef,
        ticketRef,
        arrayMessages,
        setArrayMessages,
        modalCreateConnection,
        setModalCreateConnection,
        refetchConnections,
        setRefetchConnections,
        modalEditConnection,
        setModalEditConnection
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ProviderChat;
