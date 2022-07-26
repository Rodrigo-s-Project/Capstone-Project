export type BODY_CREATE_CONNECTION = {
  name: string;
  teamId: number;
  companyId: number;
};

export type BODY_EDIT_CONNECTION = {
  name: string;
  teamId: number;
  companyId: number;
  connectionId: number;
};

export type BODY_DELETE_CONNECTION = {
  teamId: number;
  companyId: number;
  connectionId: number;
};

export type BODY_ADD_REMOVE_USER_CONNECTION = {
  teamId: number;
  companyId: number;
  connectionId: number;
  userId: number;
};
