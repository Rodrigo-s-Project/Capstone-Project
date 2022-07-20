import { CONNECTION } from "../components/Messages/messages.types";

export type DATA_GET_ALL_CONNECTIONS = {
  connections: Array<CONNECTION>;
};

export const getAllConnections = {
  url: (companyId: any, teamId: any) =>
    `${process.env.API_URL}/dashboard/chat/connections/get-all-connections/${companyId}/${teamId}`,
  method: "get"
};
