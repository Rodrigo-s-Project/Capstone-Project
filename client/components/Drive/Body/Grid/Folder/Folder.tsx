import styles from "./Folder.module.scss";
import { DOCUMENT_DATA } from "../../../../../routes/drive.routes";

type Props = {
  folderRef: DOCUMENT_DATA;
};

const Folder = ({ folderRef }: Props) => {
  return (
    <div className={styles.folder}>
      <div>{folderRef.name}</div>
    </div>
  );
};

export default Folder;
