import { Folder } from "../../models/Folder";
import { File } from "../../models/File";

export const isNameRepeated = async (
  typeCheck: "company" | "team",
  reqUser: any,
  newName: string
): Promise<boolean> => {
  try {
    if (typeCheck == "company") {
      const arrayModels: Array<any> = await reqUser.getCompanies({
        where: {
          name: newName
        }
      });

      return arrayModels.length != 0;
    } else {
      const arrayModels: Array<any> = await reqUser.getTeams({
        where: {
          name: newName
        }
      });

      return arrayModels.length != 0;
    }
  } catch (error) {
    console.error(error);
    return true; // Just to prevent update when error
  }
};

export const isNameRepeatedDocuments = async (
  name: string,
  folderId: number,
  bucketId: number
): Promise<boolean> => {
  try {
    let config: any = {};
    if (folderId != 0) {
      config = {
        hasParent: true,
        folderId,
        bucketId,
        name
      };
    } else {
      config = {
        hasParent: false,
        bucketId,
        name
      };
    }
    const arrayFolders: Array<any> = await Folder.findAll({
      where: config
    });

    const arrayFiles: Array<any> = await File.findAll({
      where: config
    });

    return arrayFolders.length + arrayFiles.length > 0;
  } catch (error) {
    console.error(error);
    return true; // Just to prevent update when error
  }
};
