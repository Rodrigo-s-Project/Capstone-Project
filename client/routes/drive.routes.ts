export type DATA_GET_BUCKETS = {
  buckets: Array<any>;
};

export const getAllBuckets = {
  url: (companyId: any, teamId: any) =>
    `${process.env.API_URL}/dashboard/drive/get-buckets/${companyId}/${teamId}`,
  method: "get"
};

export type DOCUMENT_DATA = {
  id: number;
  name: string;
  isProtected: boolean;
  type?: string; // Only files
  bucketId: number;
  folderId: number;
  User_Read_Files?: Array<any>; // Only files
};

export type USER_WORKSPACE_ASIDE = {
  User_Buckets: {
    bucketId: number;
    createdAt: any;
    updatedAt: any;
    userId: number;
  };
  email: string;
  globalUsername: string;
  id: number;
  isDarkModeOn: boolean;
  profilePictureURL: any;
  status: string;
  username: string;
  typeUser: string;
};

export type DATA_GET_DOCUMENTS = {
  folders: Array<DOCUMENT_DATA>;
  files: Array<DOCUMENT_DATA>;
  users: Array<USER_WORKSPACE_ASIDE>;
};

export const getAllDocumentsFromBucket = {
  url: (teamId: any, bucketId: any, folderId: any) =>
    `${process.env.API_URL}/dashboard/drive/get-documents/${teamId}/${bucketId}/${folderId}`,
  method: "get"
};

export type BODY_CREATE_FOLDER = {
  name: string;
  folderId: number;
  bucketId: number;
  companyId: number;
};

export const createFolder = {
  url: `${process.env.API_URL}/dashboard/drive/create-folder`,
  method: "post"
};

export type BODY_EDIT_FOLDER = {
  name: string;
  folderId: number;
  bucketId: number;
  companyId: number;
  isProtected: boolean;
};

export const editFolder = {
  url: `${process.env.API_URL}/dashboard/drive/edit-folder`,
  method: "put"
};

export const deleteFolder = {
  url: (companyId: any, bucketId: any, folderId: any) =>
    `${process.env.API_URL}/dashboard/drive/delete-folder/${companyId}/${bucketId}/${folderId}`,
  method: "delete"
};

export type BODY_UPLOAD_FILE = {
  name: string;
  folderId: number;
  bucketId: number;
  companyId: number;
  type: string;
};

export type PostFileData = {
  url: string;
  blobName: string;
};

export const addFile = {
  url: `${process.env.API_URL}/dashboard/drive/add-file`,
  method: "post"
};

export type GetFileData = {
  redirectLink: string;
};

export const getFile = {
  url: (idFile: any) =>
    `${process.env.API_URL}/dashboard/drive/get-file/${idFile}`,
  method: "get"
};

export const deleteFile = {
  url: (idFile: any) =>
    `${process.env.API_URL}/dashboard/drive/delete-file/${idFile}`,
  method: "delete"
};

export const deleteFileDb = {
  url: (companyId: any, bucketId: any, fileId: any) =>
    `${process.env.API_URL}/dashboard/drive/delete-file-db/${companyId}/${bucketId}/${fileId}`,
  method: "delete"
};

export type BODY_EDIT_FILE = {
  name: string;
  fileId: number;
  bucketId: number;
  companyId: number;
  isProtected: boolean;
};

export const editFile = {
  url: `${process.env.API_URL}/dashboard/drive/edit-file`,
  method: "put"
};
