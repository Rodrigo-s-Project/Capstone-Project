import styles from "./Submit.module.scss";
import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";
import { MyFile } from "../Files";
import { GlobalContext } from "../../../../../pages/_app";
import { DriveContext } from "../../../Provider";
import { useContext, useRef, Dispatch, SetStateAction } from "react";

import axios from "axios";

import { RESPONSE } from "../../../../../routes/index.routes";
import { PostFileData, addFile } from "../../../../../routes/drive.routes";

type Props = {
  show: boolean;
  arrayFiles: Array<MyFile>;
  setArrayFiles: Dispatch<SetStateAction<Array<MyFile>>>;
  clean: () => any;
};

const SubmitComponent = ({ show, arrayFiles, clean, setArrayFiles }: Props) => {
  const { setArrayMsgs, selectedCompany } = useContext(GlobalContext);
  const { arrayFoldersTimeLine, selectedBucket, fetchDocuments } = useContext(
    DriveContext
  );

  const currFiles = useRef<Array<MyFile>>([]);

  const getParentFolderId = (): string => {
    if (!arrayFoldersTimeLine) return "0";
    if (arrayFoldersTimeLine.length == 0) return "0";

    return arrayFoldersTimeLine[arrayFoldersTimeLine.length - 1].id.toString();
  };

  const changeStageFile = (
    index: number,
    stage: "not-loading" | "loading" | "uploaded"
  ): Array<MyFile> => {
    let aux: Array<MyFile> = [];
    for (let i = 0; i < currFiles.current.length; i++) {
      if (i == index) {
        aux.push({
          file: currFiles.current[i].file,
          type: currFiles.current[i].type,
          stageLoadingFile: stage
        });
        continue;
      }
      aux.push(currFiles.current[i]);
    }
    setArrayFiles(aux);
    return aux;
  };

  const uploadASingleFile = async (index: number) => {
    try {
      if (!selectedBucket || !selectedCompany) return;
      const singleFile: MyFile = currFiles.current[index];

      const bodyFormData: FormData = new FormData();
      bodyFormData.append("file", singleFile.file);
      bodyFormData.append("name", singleFile.file.name);
      bodyFormData.append("folderId", getParentFolderId());
      bodyFormData.append("bucketId", selectedBucket.id.toString());
      bodyFormData.append("companyId", selectedCompany.id.toString());
      bodyFormData.append("type", singleFile.type);

      currFiles.current = changeStageFile(index, "loading");

      const response = await axios.post(addFile.url, bodyFormData, {
        withCredentials: true
      });

      currFiles.current = changeStageFile(index, "uploaded");
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

      // const dataFiles: PostFileData = data.data;
      if (index == currFiles.current.length - 1) {
        // Clean
        if (fetchDocuments && arrayFoldersTimeLine) {
          fetchDocuments({
            bucket: selectedBucket,
            arrayFoldersTimeLine: arrayFoldersTimeLine
          });
        }
        clean();
        return;
      }
      await uploadASingleFile(index + 1);
    } catch (error) {
      console.error(error);

      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      }
    }
  };

  return (
    <>
      {show && (
        <div className={styles.submit}>
          <BtnSpinner
            text="Upload file(s)"
            callback={() => {
              currFiles.current = arrayFiles;
              uploadASingleFile(0);
            }}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-click-upload-files"
          />
        </div>
      )}
    </>
  );
};

export default SubmitComponent;
