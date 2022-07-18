import styles from "./File.module.scss";
import { useContext, useState } from "react";
import { DOCUMENT_DATA } from "../../../../../routes/drive.routes";

// Icons
import EditIcon from "../../../../Svgs/Edit";
import TimesIcon from "../../../../Svgs/Times";
import FileDownloadIcon from "../../../../Svgs/FileDownload";
import Loader from "../../../../Loader/Spinner/Spinner";

import axios from "axios";
import {
  getFile as getFileEndpoint,
  GetFileData,
  deleteFile
} from "../../../../../routes/drive.routes";
import { RESPONSE } from "../../../../../routes/index.routes";

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

  const getFile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getFileEndpoint.url(fileRef.id), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (data.readMsg && setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      const dataFetch: GetFileData = data.data;
      const redirectLink: string = dataFetch.redirectLink;

      setIsLoading(true);

      const responseBlobFetch = await fetch(redirectLink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      const responseBlob: Blob = await responseBlobFetch.blob();

      setIsLoading(false);

      if (responseBlob != null) {
        const url = window.URL.createObjectURL(responseBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileRef.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        await axios.delete(deleteFile.url(fileRef.id), {
          withCredentials: true
        });
      } else {
        if (setArrayMsgs) {
          setArrayMsgs(prev => [
            ...prev,
            {
              type: "danger",
              text: "Error al descargar el archivo"
            }
          ]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Error al downloading the file"
          },
          ...prev
        ]);
      }
    }
  };

  return (
    <div className={`${styles.file} ${isOpen && styles.file_open}`}>
      <div className={styles.presentation}>
        <div
          onClick={() => {
            if (!isLoading) {
              if (!isFileEditable()) return;
              setIsOpen(true);
              setNameFile(fileRef.name);
              setIsProtectedFile(fileRef.isProtected);
            }
          }}
          className={styles.file_edit}
          title="Edit file"
        >
          {isFileEditable() && <EditIcon />}
        </div>

        <div className={styles.file_types}>
          <div>{fileRef.type}</div>
          <div
            onClick={() => {
              if (!isLoading) {
                getFile();
              }
            }}
            className={styles.download}
          >
            {!isLoading && <FileDownloadIcon />}
            {isLoading && (
              <Loader additionalClass="loader-file" color="lavender-300" />
            )}
          </div>
        </div>
        <div className={styles.file_name}>{fileRef.name}</div>
      </div>

      {isFileEditable() && (
        <div className={styles.data}>
          {!isOnDeleting && (
            <>
              <div className={styles.open_top}>
                <div className={styles.open_title}>Edit</div>
                <div
                  onClick={() => {
                    if (!isLoading) {
                      clean();
                    }
                  }}
                  className={styles.open_times}
                >
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
                        !isLoading &&
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
                  callback={() => {
                    if (!isLoading) {
                    }
                  }}
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
                  if (!isLoading) {
                    setIsOnDeleting(false);
                  }
                }}
                color="gray"
                border="round_5"
                additionalClass="btn-ask-file"
              />
              <BtnSpinner
                text="Delete"
                callback={() => {
                  if (!isLoading) {
                  }
                }}
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
