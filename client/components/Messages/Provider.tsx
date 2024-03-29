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
import { useInterval } from "../../hooks/useInterval";
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
  modalCanvas: boolean;
  setModalCanvas: Dispatch<SetStateAction<boolean>>;
  modalEditConnection: boolean;
  setModalEditConnection: Dispatch<SetStateAction<boolean>>;
  modalAddUsersConnection: boolean;
  setModalAddUsersConnection: Dispatch<SetStateAction<boolean>>;

  isDrawingFinished: boolean;
  setIsDrawingFinished: Dispatch<SetStateAction<boolean>>;
  isCanvasNeedToClear: boolean;
  setIsCanvasNeedToClear: Dispatch<SetStateAction<boolean>>;
  messagesText: string;
  setMessagesText: Dispatch<SetStateAction<string>>;
  breakInterval: () => void;
  startInterval: () => void;
  pauseInterval: () => void;
  continueInterval: () => void;
  secondsDrawing: number;
  setSecondsDrawing: Dispatch<SetStateAction<number>>;

  imgState: string;
  setImgState: Dispatch<SetStateAction<string>>;
  imgStateUrl: string;
  setImgStateUrl: Dispatch<SetStateAction<string>>;
}

const ProviderChat = ({ children }: Props) => {
  const { selectedCompany, selectedTeam, setArrayMsgs } = useContext(
    GlobalContext
  );

  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [isLoadingBody, setIsLoadingBody] = useState(false);
  const [modalCreateConnection, setModalCreateConnection] = useState(false);
  const [modalEditConnection, setModalEditConnection] = useState(false);
  const [modalAddUsersConnection, setModalAddUsersConnection] = useState(false);
  const [modalCanvas, setModalCanvas] = useState(false);
  const [refetchConnections, setRefetchConnections] = useState(false);

  const [imgState, setImgState] = useState<any>("");
  const [imgStateUrl, setImgStateUrl] = useState<any>("");

  const [selectedConnection, setSelectedConnection] = useState<
    CONNECTION | undefined
  >(undefined);

  const [arrayConnections, setArrayConnections] = useState<Array<CONNECTION>>(
    []
  );

  // Draw
  const [isDrawingFinished, setIsDrawingFinished] = useState<boolean>(false);

  // To clear canvas
  const [isCanvasNeedToClear, setIsCanvasNeedToClear] = useState<boolean>(
    false
  );
  // Canvas Messages
  const [messagesText, setMessagesText] = useState<string>("");

  // Time system
  const [secondsDrawing, setSecondsDrawing] = useState<number>(0);
  const [
    breakInterval,
    startInterval,
    pauseInterval,
    continueInterval
  ] = useInterval(setSecondsDrawing, secondsDrawing, 10);

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
    ) {
      return;
    }

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
  }, [
    selectedCompany,
    selectedTeam,
    router,
    setArrayMsgs,
    refetchConnections,
    isLoadingConnections
  ]);

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
        modalCanvas,
        setModalCanvas,
        arrayMessages,
        setArrayMessages,
        modalCreateConnection,
        setModalCreateConnection,
        refetchConnections,
        setRefetchConnections,
        modalEditConnection,
        setModalEditConnection,
        modalAddUsersConnection,
        isDrawingFinished,
        setIsDrawingFinished,
        isCanvasNeedToClear,
        setIsCanvasNeedToClear,
        messagesText,
        setMessagesText,
        breakInterval,
        startInterval,
        pauseInterval,
        continueInterval,
        setModalAddUsersConnection,
        secondsDrawing,
        setSecondsDrawing,
        imgState,
        setImgState,
        imgStateUrl,
        setImgStateUrl
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ProviderChat;
