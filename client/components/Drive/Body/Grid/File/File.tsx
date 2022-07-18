import styles from "./File.module.scss";
import { useContext, useState } from "react";
import { DOCUMENT_DATA } from "../../../../../routes/drive.routes";

// Icons
import FolderIcon from "../../../../Svgs/Folder";
import FolderOpenIcon from "../../../../Svgs/FolderOpen";
import EditIcon from "../../../../Svgs/Edit";
import TimesIcon from "../../../../Svgs/Times";
import LockIcon from "../../../../Svgs/Lock";
import LockOpenIcon from "../../../../Svgs/LockOpen";

// Context
import { DriveContext } from "../../../Provider";
import { GlobalContext } from "../../../../../pages/_app";

// Components
import InputText from "../../../../Input/Text/InputText";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";

type Props = {
  fileRef: DOCUMENT_DATA;
};

const FileComponent = ({ fileRef }: Props) => {
  const {
    setArrayFoldersTimeLine,
    fetchDocuments,
    selectedBucket,
    arrayFoldersTimeLine
  } = useContext(DriveContext);

  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isOnDeleting, setIsOnDeleting] = useState(false);
  const [nameFile, setNameFile] = useState<string>("");
  const [isProtectedFile, setIsProtectedFile] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFileEditable = () => {
    if (
      selectedCompany &&
      (selectedCompany.User_Company.typeUser == "Admin" ||
        selectedCompany.User_Company.typeUser == "Employee")
    )
      return true;

    return !fileRef.isProtected;
  };

  const clean = () => {
    setIsOpen(false);
    setNameFile("");
    setIsProtectedFile(true);
    setIsOnDeleting(false);
  };

  return (
    <div className={`${styles.file} ${isOpen && styles.file_open}`}>
      <div className={styles.presentation}>
        <div
          onClick={() => {
            if (!isFileEditable()) return;
            setIsOpen(true);
            setNameFile(fileRef.name);
            setIsProtectedFile(fileRef.isProtected);
          }}
          className={styles.file_edit}
          title="Edit file"
        >
          {isFileEditable() && <EditIcon />}
        </div>

        <div className={styles.file_types}>
          <div>{fileRef.type}</div>
        </div>
        <div className={styles.file_name}>{fileRef.name}</div>
      </div>

      {isFileEditable() && (
        <div className={styles.data}>
          {!isOnDeleting && (
            <>
              <div className={styles.open_top}>
                <div className={styles.open_title}>Edit</div>
                <div onClick={clean} className={styles.open_times}>
                  <TimesIcon />
                </div>
              </div>
              <div className={styles.open_container}>
                <InputText
                  text="Edit name"
                  value={nameFile}
                  setValue={setNameFile}
                  id="name-folder-edit"
                  name="Edit folder name"
                  type="text"
                  additionalClass="input-edit-folder"
                />

                <div className={styles.open_container_type}>
                  Protection:
                  <span
                    onClick={() => {
                      if (
                        selectedCompany &&
                        (selectedCompany.User_Company.typeUser == "Admin" ||
                          selectedCompany.User_Company.typeUser == "Employee")
                      ) {
                        setIsProtectedFile(prev => !prev);
                      }
                    }}
                  >
                    {isProtectedFile ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <BtnSpinner
                  text="Save changes"
                  callback={() => {}}
                  color="lavender-300"
                  border="round_5"
                  additionalClass="btn-edit-file"
                  isLoading={isLoading}
                />
                <div
                  onClick={() => {
                    setIsOnDeleting(true);
                  }}
                  className={styles.open_container_delete}
                >
                  Delete file
                </div>
              </div>
            </>
          )}
          {isOnDeleting && (
            <>
              <div className={styles.open_container_ask}>
                Are you sure you want to delete this file?
              </div>
              <BtnSpinner
                text="Cancel"
                callback={() => {
                  setIsOnDeleting(false);
                }}
                color="gray"
                border="round_5"
                additionalClass="btn-ask-file"
              />
              <BtnSpinner
                text="Delete"
                callback={() => {}}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-ask-file"
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileComponent;
