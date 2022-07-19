import { RESPONSE } from "../../controllers.types";
import { Bucket } from "../../../models/Bucket";
import { User } from "../../../models/User";
import { Folder } from "../../../models/Folder";
import { File } from "../../../models/File";

// GCP
import { File as FileType, Storage } from "@google-cloud/storage";
import path from "path";
import { createHmac } from "crypto";

const StorageAnyType: any = Storage;

const gc: any = new StorageAnyType({
  keyFilename: path.join(
    __dirname,
    `../../../config/teamplace-356717-75468db981c2.json`
  ),
  projectId: "teamplace-356717"
});

const bucket = gc.bucket("teamplace_bucket");

import {
  BODY_CREATE_BUCKET,
  BODY_KICK_ADD_USER,
  BODY_EDIT_BUCKET,
  BODY_DELETE_BUCKET
} from "./buckets.types";

export const getBucketsFromTeam = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { companyId, teamId } = req.params;

    if (isNaN(teamId) || isNaN(companyId)) {
      response.readMsg = true;
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];

    const arrayBuckets: Array<any> = await team.getBuckets();
    let finalArrayBuckets: Array<any> = [];

    for (let i = 0; i < arrayBuckets.length; i++) {
      const isUserInBucket: boolean = await arrayBuckets[i].hasUser(req.user);

      if (isUserInBucket) {
        finalArrayBuckets.push(arrayBuckets[i]);
      }
    }

    response.data = {
      buckets: finalArrayBuckets
    };
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

export const createBucket = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { companyId, teamId, name }: BODY_CREATE_BUCKET = req.body;

    if (isNaN(teamId) || isNaN(companyId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const bucketsSameName: Array<any> = await team.getBuckets({
      where: {
        name
      }
    });

    if (bucketsSameName.length > 0) {
      response.message = "Name is repeated.";
      res.json(response);
      return;
    }
    // ---- Bucket
    // Create main bucket
    const bucketRef = await Bucket.create({
      name
    });
    await team.addBucket(bucketRef);

    // Then add the relation to that bucket with this user
    await req.user.addBucket(bucketRef);

    response.message = "Workspace created successfully!";
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

export const kickAddUserToBucket = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const {
      companyId,
      teamId,
      userId,
      bucketId
    }: BODY_KICK_ADD_USER = req.body;

    if (isNaN(teamId) || isNaN(companyId) || isNaN(bucketId) || isNaN(userId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const bucketsRef: Array<any> = await team.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (bucketsRef.length == 0) {
      response.message = "Invalid Id.";
      res.json(response);
      return;
    }

    const bucketRef: any = bucketsRef[0];

    const userRef: any = await User.findByPk(userId);

    if (!userRef) {
      response.message = "Invalid Id.";
      res.json(response);
      return;
    }

    const hasBucket: boolean = await bucketRef.hasUser(userRef);
    const totalUsersInBucket: Array<any> = await bucketRef.getUsers();

    if (hasBucket) {
      // Kick user
      if (userRef.id == company.adminId) {
        response.message = "You cannot kick the admin.";
        res.json(response);
        return;
      }

      if (totalUsersInBucket.length == 1) {
        response.message = "You cannot kick yourself.";
        res.json(response);
        return;
      }

      // Remove the relation to that bucket with this user
      await userRef.removeBucket(bucketRef);
    } else {
      // Add user
      // Add the relation to that bucket with this user
      await userRef.addBucket(bucketRef);
    }

    response.message = "";
    response.typeMsg = "success";
    response.readMsg = false;

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

export const editNameBucket = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { companyId, teamId, name, bucketId }: BODY_EDIT_BUCKET = req.body;

    if (isNaN(teamId) || isNaN(companyId) || isNaN(bucketId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    if (name.trim() == "") {
      response.message = "Invalid new name.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const bucketsRef: Array<any> = await team.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (bucketsRef.length == 0) {
      response.message = "Invalid Id.";
      res.json(response);
      return;
    }

    const bucketRef: any = bucketsRef[0];

    const bucketsSameName: Array<any> = await team.getBuckets({
      where: {
        name
      }
    });

    if (bucketsSameName.length > 0) {
      response.message = "That name is repeated.";
      res.json(response);
      return;
    }

    if (bucketRef.name == "Main directory") {
      response.message = "You can't edit this workspace.";
      res.json(response);
      return;
    }

    await bucketRef.update({
      name
    });

    response.message = "";
    response.typeMsg = "success";
    response.readMsg = false;

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

export const deleteBucket = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { companyId, teamId, bucketId }: BODY_DELETE_BUCKET = req.body;

    if (isNaN(teamId) || isNaN(companyId) || isNaN(bucketId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const bucketsRef: Array<any> = await team.getBuckets({
      where: {
        id: bucketId
      }
    });

    if (bucketsRef.length == 0) {
      response.message = "Invalid Id.";
      res.json(response);
      return;
    }

    const bucketRef: any = bucketsRef[0];

    if (bucketRef.name == "Main directory") {
      response.message = "You can't delete this workspace.";
      res.json(response);
      return;
    }

    // Delete folders
    await Folder.destroy({
      where: {
        bucketId: bucketRef.id
      }
    });

    // Delete files
    const allFiles: Array<any> = await File.findAll({
      where: {
        bucketId: bucketRef.id
      }
    });

    for (let i = 0; i < allFiles.length; i++) {
      // Delete from GCP
      const blobName: string = `${createHmac("sha256", "development")
        .update(allFiles[i].id.toString())
        .digest("hex")}${allFiles[i].type}`;

      const myFile: FileType = bucket.file(blobName);
      await myFile.delete();

      // Delete user-read files
      await allFiles[i].removeUsers();
    }

    await File.destroy({
      where: {
        bucketId: bucketRef.id
      }
    });

    // Delete association team
    await team.removeBucket(bucketRef);

    // Delete bucket
    await bucketRef.destroy();

    response.message = "Deleted bucket successfully!";
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
