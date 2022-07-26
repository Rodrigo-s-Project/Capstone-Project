import { Folder } from "../../models/Folder";
import { getNewNameForDocument } from "../helpers/index";

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
        const newName: string = await getNewNameForDocument(
          doc.name,
          doc.name,
          null,
          folderRef.bucketId
        );
        await doc.update({
          hasParent: false,
          name: newName
        });
      }
      for (let i = 0; i < childrenFiles.length; i++) {
        const doc: any = childrenFiles[i];
        const newName: string = await getNewNameForDocument(
          doc.name,
          doc.name,
          null,
          folderRef.bucketId
        );
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
      const newName: string = await getNewNameForDocument(
        doc.name,
        doc.name,
        folderParent.id,
        folderRef.bucketId
      );
      await folderParent.addFolder(doc);
      await doc.update({
        name: newName
      });
    }
    for (let i = 0; i < childrenFiles.length; i++) {
      const doc: any = childrenFiles[i];
      const newName: string = await getNewNameForDocument(
        doc.name,
        doc.name,
        folderParent.id,
        folderRef.bucketId
      );
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
