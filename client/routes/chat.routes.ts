import { CONNECTION, MESSAGE } from "../components/Messages/messages.types";

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

export type BODY_CREATE_CONNECTION = {
  name: string;
  teamId: number;
  companyId: number;
};

export const createConnection = {
  url: `${process.env.API_URL}/chat/create-connection`,
  method: "post"
};

export type BODY_EDIT_CONNECTION = {
  name: string;
  teamId: number;
  companyId: number;
  connectionId: number;
};

export const editConnection = {
  url: `${process.env.API_URL}/chat/edit-connection`,
  method: "put"
};

export type BODY_DELETE_CONNECTION = {
  teamId: number;
  companyId: number;
  connectionId: number;
};

export const deleteConnection = {
  url: `${process.env.API_URL}/chat/delete-connection`,
  method: "put"
};

export type BODY_ADD_REMOVE_USER_CONNECTION = {
  teamId: number;
  companyId: number;
  connectionId: number;
  userId: number;
};

export const addRemoveUserConnection = {
  url: `${process.env.API_URL}/chat/add-remove-user-connection`,
  method: "put"
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

export const emitGetMessages = {
  method: "get-messages",
  body: (connectionId: number) => [connectionId]
};

export const emitCreateMessage = {
  method: "create-message",
  body: (
    connectionId: number,
    text: string | undefined,
    mediaURL: string | undefined,
    lat: number | undefined,
    lng: number | undefined,
    language: string | undefined
  ) => [connectionId, text, mediaURL, lat, lng, language]
};

// On
export const onAccept = "accept";
export const onReject = "reject";
export const onGetAllConnections = "send-connections";

export const ontGetMessages = "send-messages";

export type DATA_GET_MESSAGES = {
  messages: Array<MESSAGE>;
};
