export type COMPANY = {
  adminId: number;
  accessCodeClient: string;
  accessCodeEmployee: string;
  companyPictureURL: string;
  id: number;
  name: string;
  typeCompany: "Basic" | "Enterprise";
  storage: number;
  User_Company: {
    companyId: number;
    typeUser: "Employee" | "Admin" | "Client";
    userId: number;
    username: string;
    typeAccount: "Free" | "Basic" | "Enterprise";
  };
};

export type DATA_GET_COMPANIES = {
  companies: Array<COMPANY>;
};

export const getCompaniesEndpoint = {
  url: `${process.env.API_URL}/dashboard/company/get-companies`,
  method: "get"
};

export type DATA_GET_COMPANY = {
  company: COMPANY;
};

export const getCompanyEndpoint = {
  url: (id: any) =>
    `${process.env.API_URL}/dashboard/company/get-company/${id}`,
  method: "get"
};

export type BODY_CREATE_COMPANY = {
  name: string;
};

export const createCompanyEndpoint = {
  url: `${process.env.API_URL}/dashboard/company/create-company`,
  method: "post"
};

export type BODY_JOIN_COMPANY = {
  code: string;
};

export const joinCompanyEndpoint = {
  url: `${process.env.API_URL}/dashboard/company/join-company`,
  method: "put"
};

export type USER_COMPANY = {
  id: number;
  email: string;
  globalUsername: string;
  status: string;
  profilePictureURL: string;
  isDarkModeOn: boolean;
  User_Company: {
    companyId: number;
    typeAccount: "Free" | "Basic" | "Enterprise";
    typeUser: "Employee" | "Admin" | "Client";
    userId: number;
    username: string;
  };
};

export type DATA_GET_USER_COMPANY = {
  users: Array<USER_COMPANY>;
};

export const getUsersCompanyEndpoint = {
  url: (idCompany: any) =>
    `${process.env.API_URL}/dashboard/company/get-company-users/${idCompany}`,
  method: "get"
};
