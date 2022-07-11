export type BODY_EDIT_SECTION = {
  typeEdit: "company" | "team";
  identifier:
    | "name"
    | "code-employees"
    | "code-clients"
    | "code"
    | "img"
    | "username";
  teamId?: number;
  companyId: number;
  updatedValue?: string;
  isUpdateOnSingleModel: boolean;
};

export type DATA_EDIT_SECTION = {
  newModel: any;
};

export const editControlEndpoint = {
  url: (companyId: number) =>
    `${process.env.API_URL}/dashboard/controls/edit/${companyId}`,
  method: "put"
};
