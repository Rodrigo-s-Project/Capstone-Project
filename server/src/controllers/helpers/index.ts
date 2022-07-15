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
  folderId: any,
  bucketId: number,
  allowSelf: boolean
): Promise<boolean> => {
  try {
    let config: any = {};

    if (folderId != 0 && folderId != "null" && folderId != null) {
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

    return arrayFolders.length + arrayFiles.length > (allowSelf ? 1 : 0);
  } catch (error) {
    console.error(error);
    return true; // Just to prevent update when error
  }
};
