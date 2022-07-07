export type COMPANY = {
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

export type DATA_GET_COMPANIES = {
  companies: Array<COMPANY>;
};

export const getCompaniesEndpoint = {
  url: `${process.env.API_URL}/dashboard/company/get-companies`,
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
