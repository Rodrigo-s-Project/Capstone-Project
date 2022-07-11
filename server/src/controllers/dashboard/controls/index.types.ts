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
