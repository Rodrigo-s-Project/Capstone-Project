export type BODY_UPLOAD_FILE = {
  name: string;
  folderId: any;
  bucketId: any;
  companyId: any;
  type: string;
};

export type PostFileData = {
  url: string;
  blobName: string;
};

export type GetFileData = {
  redirectLink: string;
};

export type BODY_EDIT_FILE = {
  name: string;
  fileId: number;
  bucketId: number;
  companyId: number;
  isProtected: boolean;
};
