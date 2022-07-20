export type BODY_CREATE_BUCKET = {
  teamId: number;
  companyId: number;
  name: string;
};

export type BODY_KICK_ADD_USER = {
  teamId: number;
  companyId: number;
  userId: number;
  bucketId: number;
};

export type BODY_EDIT_BUCKET = {
  teamId: number;
  companyId: number;
  bucketId: number;
  name: string;
};

export type BODY_DELETE_BUCKET = {
  teamId: number;
  companyId: number;
  bucketId: number;
};
