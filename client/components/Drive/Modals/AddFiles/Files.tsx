import styles from "./files.module.scss";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import { DriveContext } from "../../Provider";
import { GlobalContext } from "../../../../pages/_app";
import {
  useContext,
  useState,
  useRef,
  useCallback,
  Fragment,
  useEffect
} from "react";

// Dropzone
import { useDropzone } from "react-dropzone";

// Components
import Inputs from "./Inputs/Inputs";
import EachFile from "./File/File";
import SubmitEl from "./Submit/Submit";

// Own Types
export interface MyFile {
  file: File;
  type: string;
  stageLoadingFile: "not-loading" | "loading" | "uploaded";
}

const FilesModal = () => {
  const {
    modalPopUpAddFiles,
    setModalPopUpAddFiles,
    arrayDocuments
  } = useContext(DriveContext);

  const { setArrayMsgs } = useContext(GlobalContext);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [arrayFiles, setArrayFiles] = useState<Array<MyFile>>([]);
  const arrayFilesNames = useRef<Array<string>>([]);

  const updateCurrNames = useCallback(() => {
    let arrNames: Array<string> = [];
    if (!arrayDocuments || !arrayDocuments.files) return;
    for (let i = 0; i < arrayDocuments.files.length; i++) {
      arrNames.push(arrayDocuments.files[i].name);
    }

    arrayFilesNames.current = arrNames;
  }, [arrayDocuments]);

  useEffect(() => {
    if (arrayDocuments && arrayDocuments.files) {
      updateCurrNames();
    }
  }, [arrayDocuments, updateCurrNames]);

  // Drop Zone
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      let arrayFilesAux: Array<MyFile> = [];
      let arrayFilesNamesAux: Array<string> = [];
      let everythingFine: boolean = true;

      for (let i = 0; i < acceptedFiles.length; i++) {
        let type: string = "";
        let hadBreak: boolean = false;
        const file: File = acceptedFiles[i];

        // Type
        for (let j = 1; j <= file.name.length; j++) {
          const letter: string = file.name[file.name.length - j];
          if (letter != ".") {
            type = letter + type;
          } else {
            type = letter + type;
            hadBreak = true;
            break;
          }
        }

        if (!hadBreak) {
          // FAIL everything
          everythingFine = false;
          break;
        }

        arrayFilesNamesAux.push(file.name);
        arrayFilesAux.push({
          file,
          type,
          stageLoadingFile: "not-loading"
        });
      }

      // Complete names in this round and before rounds
      arrayFilesNamesAux = [...arrayFilesNamesAux, ...arrayFilesNames.current];

      // Check if is repeated
      const noDuplicates = new Set(arrayFilesNamesAux);

      if (arrayFilesNamesAux.length !== noDuplicates.size) {
        // FAIL
        if (setArrayMsgs) {
          setArrayMsgs(prev => [
            {
              type: "danger",
              text: "You cannot upload files with the same name."
            },
            ...prev
          ]);
        }
      } else {
        if (everythingFine) {
          // SUCCESS
          arrayFilesNames.current = arrayFilesNamesAux;
          setArrayFiles(prev => [...prev, ...arrayFilesAux]);
        } else {
          // FAIL
          if (setArrayMsgs) {
            setArrayMsgs(prev => [
              {
                type: "danger",
                text:
                  "Error while reading the files. Check the file type: (.png, .pdf, etc...)."
              },
              ...prev
            ]);
          }

          // Clean files
          setArrayFiles([]);
          arrayFilesNames.current = [];
          setIsLoading(false);
        }
      }
    },
    [setArrayMsgs]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const deleteFile = (index: number) => {
    let aux: Array<MyFile> = [];
    let names: Array<string> = [];
    for (let i = 0; i < arrayFiles.length; i++) {
      if (index != i) {
        aux.push(arrayFiles[i]);
        names.push(arrayFiles[i].file.name);
      }
    }
    setArrayFiles(aux);
    arrayFilesNames.current = names;
  };

  const clean = () => {
    setArrayFiles([]);
    setIsLoading(false);
    arrayFilesNames.current = [];
    if (setModalPopUpAddFiles) setModalPopUpAddFiles(false);
  };

  return (
    <PopUpModal
      extraCss={styles.card}
      isModal={modalPopUpAddFiles}
      setIsModal={setModalPopUpAddFiles}
      callbackClose={clean}
    >
      <h2 className={styles.h2}>Add files</h2>
      <div className={styles.container}>
        <div className={styles.drop} {...getRootProps()}>
          <input {...getInputProps()} />
          <Inputs isActive={isDragActive} onlyBtn={arrayFiles.length > 0} />
        </div>
        <div className={styles.files}>
          {arrayFiles.map((eachFile: MyFile, index: number) => {
            return (
              <Fragment key={index}>
                <EachFile
                  {...eachFile}
                  deleteFile={() => {
                    deleteFile(index);
                  }}
                />
              </Fragment>
            );
          })}
        </div>
        <SubmitEl
          clean={clean}
          arrayFiles={arrayFiles}
          setArrayFiles={setArrayFiles}
          show={arrayFiles.length > 0}
        />
      </div>
    </PopUpModal>
  );
};

export default FilesModal;
