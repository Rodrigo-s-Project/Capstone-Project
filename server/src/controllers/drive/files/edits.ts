import { RESPONSE } from "../../controllers.types";
import { File } from "../../../models/File";
import { Folder } from "../../../models/Folder";
import { createHmac } from "crypto";

// Types
import { BODY_EDIT_FILE } from "./files.types";

// Helpers
import { isNameRepeatedDocuments } from "../../helpers/index";

// GCP
import { File as FileType, Storage } from "@google-cloud/storage";
import path from "path";

const StorageAnyType: any = Storage;

const gc: any = new StorageAnyType({
  keyFilename: path.join(
    __dirname,
    `../../../config/teamplace-356717-75468db981c2.json`
  ),
  projectId: "teamplace-356717"
});

const bucket = gc.bucket("teamplace_bucket");

export const editFile = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const {
      name,
      fileId,
      bucketId,
      companyId,
      isProtected
    }: BODY_EDIT_FILE = req.body;

    if (isNaN(fileId)) {
      response.readMsg = true;
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    if (name.trim() == "") {
      response.readMsg = true;
      response.message = "Invalid name.";
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

    // Edit folder
    const fileRef: any = await File.findByPk(fileId);

    if (
      await isNameRepeatedDocuments(
        name,
        fileRef.folderId,
        bucketId,
        name == fileRef.name
      )
    ) {
      response.readMsg = true;
      response.message = "Name is repeated.";
      res.json(response);
      return;
    }

    if (!fileRef) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Check if you have permission
    if (companyRef.User_Company.typeUser == "Client" && fileRef.isProtected) {
      response.message = "You don't have the permission to edit this document.";
      res.json(response);
      return;
    }

    await fileRef.update({
      name,
      isProtected
    });

    response.message = "File edited successfully!";
    response.typeMsg = "success";
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

export const deleteFile = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { fileId, bucketId, companyId } = req.params;

    if (isNaN(fileId)) {
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

    const fileRef: any = await File.findByPk(fileId);

    if (!fileRef) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Check if you have permission
    if (companyRef.User_Company.typeUser == "Client" && fileRef.isProtected) {
      response.message =
        "You don't have the permission to delete this document.";
      res.json(response);
      return;
    }

    // Associations
    const bucketRef: any = buckets[0];
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
    const blobName: string = `${createHmac("sha256", "keys")
      .update(fileRef.id.toString())
      .digest("hex")}${fileRef.type}`;

    const myFile: FileType = bucket.file(blobName);
    await myFile.delete();

    // Destroy file
    await fileRef.destroy();

    response.message = "File deleted successfully!";
    response.typeMsg = "success";
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
