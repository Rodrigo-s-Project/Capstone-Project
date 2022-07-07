export type TEAM = {
  adminId: number;
  accessCode: string;
  companyPictureURL: string;
  id: number;
  name: string;
  User_Company: {
    companyId: number;
    typeUser: "Employee" | "Admin" | "Client";
    userId: number;
    username: string;
  };
};

export type DATA_GET_TEAMS = {
  teams: Array<TEAM>;
};

export const getTeamsEndpoint = {
  url: (companyId: number) =>
    `${process.env.API_URL}/dashboard/team/get-teams/${companyId}`,
  method: "get"
};

export type DATA_GET_TEAM = {
  team: TEAM;
};

export const getTeamEndpoint = {
  url: (id: string) => `${process.env.API_URL}/dashboard/team/get-team/${id}`,
  method: "get"
};

export type BODY_CREATE_TEAM = {
  name: string;
  companyId: number | undefined;
};

export const createTeamEndpoint = {
  url: `${process.env.API_URL}/dashboard/team/create-team`,
  method: "post"
};

export type BODY_JOIN_TEAM = {
  code: string;
  companyId: number | undefined;
};

export const joinTeamEndpoint = {
  url: `${process.env.API_URL}/dashboard/team/join-team`,
  method: "put"
};
