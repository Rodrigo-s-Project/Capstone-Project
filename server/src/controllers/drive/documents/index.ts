import { RESPONSE } from "../../controllers.types";
import { Team } from "../../../models/Team";
import { Folder } from "../../../models/Folder";
import { BODY_CREATE_FOLDER } from "./documents.types";

export const getDocumentsFromBucket = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { bucketId, teamId, folderId } = req.params;

    if (isNaN(bucketId) || isNaN(teamId)) {
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

    const bucket: any = buckets[0];
    const teamRef: any = await Team.findByPk(bucket.teamId);

    if (!teamRef) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    let arrayFinalFolders: Array<any> = [];
    let config: any;

    if (folderId != "null") {
      config = {
        hasParent: true,
        folderId
      };
    } else {
      config = {
        hasParent: false
      };
    }

    const arrayFolders: Array<any> = await bucket.getFolders({
      where: config
    });

    for (let i = 0; i < arrayFolders.length; i++) {
      const { ...folderData } = arrayFolders[i].toJSON();

      arrayFinalFolders.push({
        ...folderData,
        type: "",
        User_Read_Files: []
      });
    }

    let arrayFinalFiles: Array<any> = [];
    const arrayFiles: Array<any> = await bucket.getFiles({
      where: config
    });

    for (let i = 0; i < arrayFiles.length; i++) {
      const usersRef: Array<any> = await arrayFiles[i].getUsers();
      let arrayUsers: Array<any> = [];

      for (let j = 0; j < usersRef.length; j++) {
        let username: string = usersRef[j].globalUsername;

        const teamsUserRef: Array<any> = await usersRef[j].getTeams({
          where: {
            id: teamRef.id
          }
        });

        if (teamsUserRef.length > 0) {
          const teamUserRef: any = teamsUserRef[0];
          username = teamUserRef.User_Team.username;
        }

        const { password: userPswd, ...userData } = usersRef[j].toJSON();

        arrayUsers.push({
          userData,
          username
        });
      }

      const { ...fileData } = arrayFiles[i].toJSON();

      arrayFinalFiles.push({
        ...fileData,
        User_Read_Files: arrayUsers
      });
    }

    // Get team from bucket
    let arrayFinalUsers: Array<any> = [];
    const arrayUsers: Array<any> = await bucket.getUsers();

    for (let i = 0; i < arrayUsers.length; i++) {
      const teamsUserRef: Array<any> = await arrayUsers[i].getTeams({
        where: {
          id: teamId
        }
      });

      if (teamsUserRef.length == 0) continue;

      const teamRef: any = teamsUserRef[0];
      const companiesUserRef: Array<any> = await arrayUsers[i].getCompanies({
        where: {
          id: teamRef.companyId
        }
      });

      if (companiesUserRef.length == 0) continue;

      const companyUserRef = companiesUserRef[0];

      const { password: userPswd, ...userData } = arrayUsers[i].toJSON();

      arrayFinalUsers.push({
        ...userData,
        username: teamRef.User_Team.username,
        typeUser: companyUserRef.User_Company.typeUser
      });
    }

    response.data = {
      folders: arrayFinalFolders,
      files: arrayFinalFiles,
      users: arrayFinalUsers
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

export const createFolder = async (req, res) => {
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
      folderId,
      bucketId,
      companyId
    }: BODY_CREATE_FOLDER = req.body;
    
    if (isNaN(bucketId) || isNaN(folderId) || isNaN(companyId)) {
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
    const bucket: any = buckets[0];

    // Create folder
    const newFolder: any = await Folder.create({
      name,
      isProtected:
        companyRef.User_Company.typeUser == "Admin" ||
        companyRef.User_Company.typeUser == "Employee",
      hasParent: folderId != 0
    });

    // Add to parent
    if (folderId != 0) {
      const parentFolder: any = await Folder.findByPk(folderId);

      if (parentFolder) {
        await parentFolder.addFolder(newFolder);
      }
    }

    // Add to bucket
    await bucket.addFolder(newFolder);

    response.message = "Folder created successfully!";
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
