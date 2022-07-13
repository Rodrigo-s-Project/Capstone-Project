export type DOCUMENT_DATA = {
  id: number;
  name: string;
  isProtected: boolean;
  type?: string; // Only files
  bucketId: number;
  folderId: number;
  User_Read_Files?: Array<any>; // Only files
};
export type BODY_CREATE_FOLDER = {
  name: string;
  folderId: number;
  bucketId: number;
  companyId: number;
};
