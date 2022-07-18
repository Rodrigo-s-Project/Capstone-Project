import { MyFile } from "../Files";
import styles from "./File.module.scss";

// Icons
import LoaderIcon from "../../../../Loader/Spinner/Spinner";
import CheckIcon from "../../../../Svgs/Check";
import TrashIcon from "../../../../Svgs/TrashAlt";

interface MyFileProps extends MyFile {
  deleteFile: () => any;
}

const EachFile = ({
  file,
  type,
  stageLoadingFile,
  deleteFile
}: MyFileProps) => {
  return (
    <div className={styles.each}>
      {(stageLoadingFile == "loading" || stageLoadingFile == "uploaded") && (
        <div
          className={`${styles.each_loader} ${stageLoadingFile == "uploaded" &&
            styles.each_loader_green}`}
        >
          {stageLoadingFile == "loading" && <LoaderIcon color="primary" />}
          {stageLoadingFile == "uploaded" && <CheckIcon />}
        </div>
      )}
      <div className={styles.each_type}>{type}</div>
      <div className={styles.each_right}>
        <div className={styles.each_right_name}>{file.name}</div>
        <div title="Delete file" className={styles.each_right_trash} onClick={deleteFile}>
          <TrashIcon />
        </div>
      </div>
    </div>
  );
};

export default EachFile;
