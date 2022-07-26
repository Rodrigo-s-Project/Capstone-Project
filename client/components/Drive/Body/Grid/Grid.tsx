import styles from "./Grid.module.scss";
import { DriveContext } from "../../Provider";
import { useContext, Fragment } from "react";
import { DOCUMENT_DATA } from "../../../../routes/drive.routes";

import FolderComponent from "./Folder/Folder";
import FileComponent from "./File/File";

const GridDocuments = () => {
  const { arrayDocuments } = useContext(DriveContext);

  return (
    <div className={styles.grid}>
      {arrayDocuments && arrayDocuments.folders && arrayDocuments.files && (
        <>
          {arrayDocuments.folders
            .sort((a: DOCUMENT_DATA, b: DOCUMENT_DATA) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            })
            .map((documentRef: DOCUMENT_DATA) => {
              return (
                <Fragment key={`${documentRef.id}-${documentRef.name}`}>
                  <FolderComponent folderRef={documentRef} />
                </Fragment>
              );
            })}
          {arrayDocuments.files
            .sort((a: DOCUMENT_DATA, b: DOCUMENT_DATA) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            })
            .map((documentRef: DOCUMENT_DATA) => {
              return (
                <Fragment key={`${documentRef.id}-${documentRef.name}`}>
                  <FileComponent fileRef={documentRef} />
                </Fragment>
              );
            })}
        </>
      )}
    </div>
  );
};

export default GridDocuments;
