import { Folder } from "../../models/Folder";
import { isNameRepeatedDocuments } from "../helpers/index";

export const shiftChildrenToParent = async (
  folderRef: any
): Promise<boolean> => {
  try {
    // Find children
    const childrenFolders: Array<any> = await folderRef.getFolders();
    const childrenFiles: Array<any> = await folderRef.getFiles();

    // Remove associations
    await folderRef.removeFolders();
    await folderRef.removeFiles();

    // Find parent
    let hasParent: boolean = folderRef.hasParent;

    if (!hasParent) {
      // So update the (hasParent) of the children -> false
      for (let i = 0; i < childrenFolders.length; i++) {
        const doc: any = childrenFolders[i];
        const isNameRepeated: boolean = await isNameRepeatedDocuments(
          doc.name,
          null,
          folderRef.bucketId,
          false
        );
        let newName: string = doc.name;
        if (isNameRepeated) {
          newName = `${folderRef.name}_${newName}`;
        }

        await doc.update({
          hasParent: false,
          name: newName
        });
      }
      for (let i = 0; i < childrenFiles.length; i++) {
        const doc: any = childrenFiles[i];
        const isNameRepeated: boolean = await isNameRepeatedDocuments(
          doc.name,
          null,
          folderRef.bucketId,
          false
        );
        let newName: string = doc.name;
        if (isNameRepeated) {
          newName = `${folderRef.name}_${newName}`;
        }
        await doc.update({
          hasParent: false,
          name: newName
        });
      }

      return true;
    }

    const folderParent: any = await Folder.findByPk(folderRef.folderId);

    // Move to its folder parent
    for (let i = 0; i < childrenFolders.length; i++) {
      const doc: any = childrenFolders[i];
      const isNameRepeated: boolean = await isNameRepeatedDocuments(
        doc.name,
        folderParent.id,
        folderParent.bucketId,
        false
      );
      let newName: string = doc.name;
      if (isNameRepeated) {
        newName = `${folderRef.name}_${newName}`;
      }
      await folderParent.addFolder(doc);

      await doc.update({
        name: newName
      });
    }
    for (let i = 0; i < childrenFiles.length; i++) {
      const doc: any = childrenFiles[i];
      const isNameRepeated: boolean = await isNameRepeatedDocuments(
        doc.name,
        folderParent.id,
        folderParent.bucketId,
        false
      );
      let newName: string = doc.name;
      if (isNameRepeated) {
        newName = `${folderRef.name}_${newName}`;
      }
      await folderParent.addFile(doc);
      await doc.update({
        name: newName
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
