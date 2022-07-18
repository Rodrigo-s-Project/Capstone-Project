import { RESPONSE } from "../../controllers.types";
import { File } from "../../../models/File";
import { Folder } from "../../../models/Folder";
import { createHmac } from "crypto";

// Types
import { BODY_UPLOAD_FILE, PostFileData } from "./files.types";

// Helpers
import { isNameRepeatedDocuments } from "../../helpers/index";

// GCP
import { File as FileType, Storage } from "@google-cloud/storage";
import path from "path";
import { format } from "util";

const StorageAnyType: any = Storage;

const gc: any = new StorageAnyType({
  keyFilename: path.join(
    __dirname,
    `../../../config/teamplace-356717-75468db981c2.json`
  ),
  projectId: "teamplace-356717"
});

const bucket = gc.bucket("teamplace_bucket");

const deleteFileOnError = async (
  req: any,
  fileId: number
): Promise<boolean> => {
  try {
    let { folderId, bucketId }: BODY_UPLOAD_FILE = req.body;

    folderId = parseInt(folderId);
    bucketId = parseInt(bucketId);

    const refFile: any = await File.findByPk(fileId);

    if (!refFile) return true; // Everything fine

    // Delete association with user read
    await req.user.removeFile(refFile);

    // Delete association with bucket
    const buckets: Array<any> = await req.user.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (buckets.length == 0) {
      return false;
    }

    const bucket: any = buckets[0];
    await bucket.removeFile(refFile);

    // Delete association with parent folderId
    if (folderId != 0) {
      const parentFolder: any = await Folder.findByPk(folderId);

      if (parentFolder) {
        await parentFolder.removeFile(refFile);
      }
    }

    // Delete file
    await refFile.destroy();

    return true;
  } catch (error) {
    console.error(`error in deleteFileOnError =>`, error);
    return false;
  }
};

const createFileInDB = async (req): Promise<number> => {
  try {
    let {
      name,
      folderId,
      bucketId,
      type,
      companyId
    }: BODY_UPLOAD_FILE = req.body;

    folderId = parseInt(folderId);
    bucketId = parseInt(bucketId);
    companyId = parseInt(companyId);

    if (name.trim() == "" || type.trim() == "") return 0;

    if (await isNameRepeatedDocuments(name, folderId, bucketId, false)) {
      return 0;
    }

    const buckets: Array<any> = await req.user.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (buckets.length == 0) {
      return 0;
    }

    const companiesUserRef: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companiesUserRef.length == 0) {
      return 0;
    }

    // Refs
    const companyUserRef: any = companiesUserRef[0];
    const bucket: any = buckets[0];

    // Create file
    const newFile: any = await File.create({
      name,
      isProtected:
        companyUserRef.User_Company.typeUser == "Admin" ||
        companyUserRef.User_Company.typeUser == "Employee",
      hasParent: folderId != 0,
      type
    });

    // Add to parent
    if (folderId != 0) {
      const parentFolder: any = await Folder.findByPk(folderId);

      if (parentFolder) {
        await parentFolder.addFile(newFile);
      }
    }

    // Add to bucket
    await bucket.addFile(newFile);

    // Add first user read file
    await req.user.addFile(newFile);

    return newFile.id;
  } catch (error) {
    console.error(`error in createFileInDB =>`, error);
    return 0;
  }
};

export const postFile = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const ourFile: any = req.file;

    const { name, type }: BODY_UPLOAD_FILE = req.body;

    if (!ourFile) {
      response.message = "You need to upload a file!";
      res.json(response);
      return;
    }

    // Upload file to DB
    const idNewFile: number = await createFileInDB(req);

    if (idNewFile == 0) {
      response.message = "Error while uploading file";
      res.json(response);
      return;
    }

    // Upload file to GCP
    // Create a new blobName

    const blobName: string = `${createHmac("sha256", "keys")
      .update(idNewFile.toString())
      .digest("hex")}${type}`;
    const blob: FileType = bucket.file(blobName);
    const blobStream = blob.createWriteStream({
      resumable: true // They can be too large
    });

    // Listen
    blobStream.on("error", async err => {
      response.message = "Error while uploading file";
      try {
        await deleteFileOnError(req, idNewFile);
        res.json(response);
      } catch (error) {
        // Send Error
        response.data = {};
        response.isAuth = true;
        response.message = error.message;
        response.readMsg = true;
        response.typeMsg = "danger";
        res.json(response);
        console.error(`error in blobStream.on =>`, error);
      }
      return;
    });

    blobStream.on("finish", async (_: any) => {
      // Create URL for directly file access via HTTPS
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      const data: PostFileData = {
        url: publicUrl,
        blobName: blob.name
      };

      // Success
      response.readMsg = false;
      response.typeMsg = "success";
      response.data = {
        file: data
      };
      res.json(response);
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(`error in postFile =>`, error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
