import { CONNECTION } from "../components/Messages/messages.types";

// Generate ticket
export type DATA_GET_TICKET = {
  tokenForSockets: {
    iv: string;
    content: string;
  };
};

export const getTicketEndpoint = {
  url: `${process.env.API_URL}/chat/generate-ticket`,
  method: "get"
};

// Emits
export const emitHandshake = {
  method: "handshake",
  body: (userId: number, companyId: number, teamId: number) => [
    userId,
    companyId,
    teamId
  ]
};

export const emitGetAllConnections = "get-connections";
export type DATA_GET_ALL_CONNECTIONS = {
  connections: Array<CONNECTION>;
};

export const emitGetMessages = "get-messages";

// On
export const onAccept = "accept";
export const onReject = "reject";
export const onGetAllConnections = "send-connections";
export const ontGetMessages = "send-messages";
