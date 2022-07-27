import { Folder } from "../../../models/Folder";
import { createHmac } from "crypto";
import { RESPONSE } from "../../controllers.types";

// GCP
import { File as FileType, Storage } from "@google-cloud/storage";
import path from "path";

const StorageAnyType: any = Storage;

const gc: any = new StorageAnyType({
  keyFilename: path.join(
    __dirname,
    `../../../config/teamplace-356717-46f9610561c9.json`
  ),
  projectId: "teamplace-356717"
});

const bucket = gc.bucket("teamplace_bucket");

const deleteFile = async (
  fileRef: any,
  companyRef: any,
  bucketRef: any
): Promise<boolean> => {
  try {
    // Check if you have permission
    if (companyRef.User_Company.typeUser == "Client" && fileRef.isProtected) {
      return false;
    }

    // Associations
    await bucketRef.removeFile(fileRef);

    // Delete association with parent folderId
    if (fileRef.folderId != 0) {
      const parentFolder: any = await Folder.findByPk(fileRef.folderId);

      if (parentFolder) {
        await parentFolder.removeFile(fileRef);
      }
    }

    // Delete associations with read users
    await fileRef.removeUsers();

    // Delete from GCP
    const blobName: string = `${createHmac("sha256", "development")
      .update(fileRef.id.toString())
      .digest("hex")}${fileRef.type}`;

    const myFile: FileType = bucket.file(blobName);
    await myFile.delete();

    // Destroy file
    await fileRef.destroy();

    return true;
  } catch (error) {
    console.error(error);
  }
};

const deleteAllChildren = async (
  arrChildren: Array<any>,
  index: number,
  companyRef: any,
  bucketRef: any
) => {
  if (index >= arrChildren.length) return true;

  const refDocu: any = arrChildren[index];

  if (!refDocu) {
    await deleteAllChildren(arrChildren, index + 1, companyRef, bucketRef);
  }

  if (refDocu.isFolder) {
    await deleteFolder(refDocu.data, companyRef, bucketRef);
  } else {
    await deleteFile(refDocu.data, companyRef, bucketRef);
  }

  await deleteAllChildren(arrChildren, index + 1, companyRef, bucketRef);
};

const deleteFolder = async (
  folderRef: any,
  companyRef: any,
  bucketRef: any
): Promise<boolean> => {
  // Delete children
  if (!folderRef) return false;

  // Check if you have permission
  if (companyRef.User_Company.typeUser == "Client" && folderRef.isProtected) {
    return false;
  }
  let childrenFiles: Array<any> = await folderRef.getFiles();
  let childrenFolders: Array<any> = await folderRef.getFolders();

  let aux: Array<any> = [];

  for (let i = 0; i < childrenFiles.length; i++) {
    aux.push({
      isFolder: false,
      data: childrenFiles[i]
    });
  }

  for (let i = 0; i < childrenFolders.length; i++) {
    aux.push({
      isFolder: true,
      data: childrenFolders[i]
    });
  }

  await deleteAllChildren(aux, 0, companyRef, bucketRef);

  // Delete folder
  await folderRef.destroy();
  return true;
};

export const deleteFolderAndItsContent = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { folderId, bucketId, companyId } = req.params;

    if (isNaN(folderId)) {
      response.readMsg = true;
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const buckets: Array<any> = await req.user.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (buckets.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companiesUserRef: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companiesUserRef.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companyRef: any = companiesUserRef[0];
    const bucketRef: any = buckets[0];
    const folderRef: any = await Folder.findByPk(folderId);

    const resDeleting: boolean = await deleteFolder(
      folderRef,
      companyRef,
      bucketRef
    );

    if (resDeleting) {
      response.message = "Folder deleted successfully!";
      response.typeMsg = "success";
    } else {
      response.message = "Something went wrong!";
      response.typeMsg = "danger";
    }
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
