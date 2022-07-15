import styles from "./Folder.module.scss";
import { useContext } from "react";
import { DOCUMENT_DATA } from "../../../../../routes/drive.routes";

// Icons
import FolderIcon from "../../../../Svgs/Folder";
import FolderOpenIcon from "../../../../Svgs/FolderOpen";
import EditIcon from "../../../../Svgs/Edit";

// Context
import { DriveContext } from "../../../Provider";

type Props = {
  folderRef: DOCUMENT_DATA;
};

const Folder = ({ folderRef }: Props) => {
  const {
    setArrayFoldersTimeLine,
    fetchDocuments,
    selectedBucket,
    arrayFoldersTimeLine
  } = useContext(DriveContext);

  const openFolder = () => {
    if (
      fetchDocuments &&
      selectedBucket &&
      setArrayFoldersTimeLine &&
      arrayFoldersTimeLine
    ) {
      setArrayFoldersTimeLine(prev => [...prev, folderRef]);
      fetchDocuments({
        bucket: selectedBucket,
        arrayFoldersTimeLine: [...arrayFoldersTimeLine, folderRef]
      });
    }
  };

  return (
    <div className={styles.folder}>
      <div className={styles.folder_edit} title="Edit folder">
        <EditIcon />
      </div>
      <div onClick={openFolder} className={styles.folder_svgs}>
        <div className={styles.folder_svgs_close}>
          <FolderIcon />
        </div>
        <div className={styles.folder_svgs_open}>
          <FolderOpenIcon />
        </div>
      </div>
      <div className={styles.folder_name}>{folderRef.name}</div>
    </div>
  );
};

export default Folder;
