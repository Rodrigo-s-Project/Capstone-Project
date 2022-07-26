import styles from "./Folder.module.scss";
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

// Routes
import axios from "axios";
import {
  editFolder,
  BODY_EDIT_FOLDER,
  deleteFolder,
  deleteCompleteFolder
} from "../../../../../routes/drive.routes";
import { RESPONSE } from "../../../../../routes/index.routes";

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

  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isOnDeleting, setIsOnDeleting] = useState(false);
  const [nameFolder, setNameFolder] = useState<string>("");
  const [isProtectedFolder, setIsProtectedFolder] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const clean = () => {
    setIsOpen(false);
    setNameFolder("");
    setIsProtectedFolder(true);
    setIsOnDeleting(false);
  };

  const editFolderFetch = async () => {
    try {
      if (!selectedBucket || !selectedCompany) return;

      setIsLoading(true);

      const body: BODY_EDIT_FOLDER = {
        name: nameFolder,
        folderId: folderRef.id,
        bucketId: selectedBucket.id,
        companyId: selectedCompany.id,
        isProtected: isProtectedFolder
      };
      const response = await axios.put(editFolder.url, body, {
        withCredentials: true
      });

      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      clean();

      if (fetchDocuments && selectedBucket && arrayFoldersTimeLine) {
        fetchDocuments({
          bucket: selectedBucket,
          arrayFoldersTimeLine: arrayFoldersTimeLine
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  const deleteFolderFetch = async () => {
    try {
      if (!selectedBucket || !selectedCompany) return;

      setIsLoading(true);

      const response = await axios.delete(
        deleteFolder.url(selectedCompany.id, selectedBucket.id, folderRef.id),
        {
          withCredentials: true
        }
      );

      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      clean();

      if (fetchDocuments && selectedBucket && arrayFoldersTimeLine) {
        fetchDocuments({
          bucket: selectedBucket,
          arrayFoldersTimeLine: arrayFoldersTimeLine
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  const deleteCompleteFolderFetch = async () => {
    try {
      if (!selectedBucket || !selectedCompany) return;

      setIsLoading(true);

      const response = await axios.delete(
        deleteCompleteFolder.url(
          selectedCompany.id,
          selectedBucket.id,
          folderRef.id
        ),
        {
          withCredentials: true
        }
      );

      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      clean();

      if (fetchDocuments && selectedBucket && arrayFoldersTimeLine) {
        fetchDocuments({
          bucket: selectedBucket,
          arrayFoldersTimeLine: arrayFoldersTimeLine
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  return (
    <div className={`${styles.folder} ${isOpen && styles.folder_open}`}>
      <div className={styles.presentation}>
        <div
          onClick={() => {
            if (!isFolderEditable()) return;
            setIsOpen(true);
            setNameFolder(folderRef.name);
            setIsProtectedFolder(folderRef.isProtected);
          }}
          className={styles.folder_edit}
          title="Edit folder"
        >
          {isFolderEditable() && <EditIcon />}
        </div>

        <div onClick={openFolder} className={styles.folder_svgs}>
          <div className={styles.folder_svgs_close}>
            <FolderIcon />
          </div>
          <div className={styles.folder_svgs_open}>
            <FolderOpenIcon />
          </div>
          <div className={styles.folder_svgs_protection}>
            {folderRef.isProtected && <LockIcon />}
            {!folderRef.isProtected && <LockOpenIcon />}
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
                <div onClick={clean} className={styles.open_times}>
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
                  <span
                    onClick={() => {
                      if (
                        selectedCompany &&
                        (selectedCompany.User_Company.typeUser == "Admin" ||
                          selectedCompany.User_Company.typeUser == "Employee")
                      ) {
                        setIsProtectedFolder(prev => !prev);
                      }
                    }}
                  >
                    {isProtectedFolder ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <BtnSpinner
                  text="Save changes"
                  callback={editFolderFetch}
                  color="lavender-300"
                  border="round_5"
                  additionalClass="btn-edit-folder"
                  isLoading={isLoading}
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
              <div className={styles.open_container_ask}>
                Are you sure you want to delete this folder?
              </div>
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
                text="Delete just folder"
                callback={deleteFolderFetch}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-ask-folder"
                isLoading={isLoading}
              />
              <BtnSpinner
                text="Delete all inside"
                callback={deleteCompleteFolderFetch}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-ask-folder"
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
