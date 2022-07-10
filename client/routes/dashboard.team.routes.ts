import { COMPANY } from "./dashboard.company.routes";

export type TEAM = {
  accessCode: string;
  teamPictureURL: string;
  companyId: number;
  id: number;
  name: string;
  User_Team: {
    teamId: number;
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
  company: COMPANY;
};

export const getTeamEndpoint = {
  url: (idCompany: any, idTeam: any) =>
    `${process.env.API_URL}/dashboard/team/get-team/${idCompany}/${idTeam}`,
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
