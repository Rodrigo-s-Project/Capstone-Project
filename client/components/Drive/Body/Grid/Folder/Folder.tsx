import styles from "./Folder.module.scss";
import { useContext, useState } from "react";
import { DOCUMENT_DATA } from "../../../../../routes/drive.routes";

// Icons
import FolderIcon from "../../../../Svgs/Folder";
import FolderOpenIcon from "../../../../Svgs/FolderOpen";
import EditIcon from "../../../../Svgs/Edit";
import TimesIcon from "../../../../Svgs/Times";

// Context
import { DriveContext } from "../../../Provider";
import { GlobalContext } from "../../../../../pages/_app";

// Components
import InputText from "../../../../Input/Text/InputText";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";

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

  const { selectedCompany } = useContext(GlobalContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isOnDeleting, setIsOnDeleting] = useState(false);
  const [nameFolder, setNameFolder] = useState<string>("");

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

  const isFolderEditable = () => {
    if (
      selectedCompany &&
      (selectedCompany.User_Company.typeUser == "Admin" ||
        selectedCompany.User_Company.typeUser == "Employee")
    )
      return true;

    return !folderRef.isProtected;
  };

  const editFolderFetch = () => {};

  const deleteFolderFetch = () => {};

  return (
    <div className={`${styles.folder} ${isOpen && styles.folder_open}`}>
      <div className={styles.presentation}>
        {isFolderEditable() && (
          <div
            onClick={() => {
              setIsOpen(true);
              setNameFolder(folderRef.name);
            }}
            className={styles.folder_edit}
            title="Edit folder"
          >
            <EditIcon />
          </div>
        )}

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

      {isFolderEditable() && (
        <div className={styles.data}>
          {!isOnDeleting && (
            <>
              <div className={styles.open_top}>
                <div className={styles.open_title}>Edit</div>
                <div
                  onClick={() => {
                    setIsOpen(false);
                    setNameFolder("");
                  }}
                  className={styles.open_times}
                >
                  <TimesIcon />
                </div>
              </div>
              <div className={styles.open_container}>
                <InputText
                  text="Edit name"
                  value={nameFolder}
                  setValue={setNameFolder}
                  id="name-folder-edit"
                  name="Edit folder name"
                  type="text"
                  additionalClass="input-edit-folder"
                />
                <div className={styles.open_container_type}>
                  Protection:
                  <span>{folderRef.isProtected ? "Enabled" : "Disabled"}</span>
                </div>
                <BtnSpinner
                  text="Save changes"
                  callback={editFolderFetch}
                  color="lavender-300"
                  border="round_5"
                  additionalClass="btn-edit-folder"
                />
                <div
                  onClick={() => {
                    setIsOnDeleting(true);
                  }}
                  className={styles.open_container_delete}
                >
                  Delete folder
                </div>
              </div>
            </>
          )}
          {isOnDeleting && (
            <>
              <div className={styles.open_container_ask}>Are you sure you want to delete this folder?</div>
              <BtnSpinner
                text="Cancel"
                callback={() => {
                  setIsOnDeleting(false);
                }}
                color="gray"
                border="round_5"
                additionalClass="btn-ask-folder"
              />
              <BtnSpinner
                text="Delete"
                callback={deleteFolderFetch}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-ask-folder"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
