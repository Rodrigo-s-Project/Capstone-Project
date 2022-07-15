import styles from "./AddFolder.module.scss";
import { useContext, useState, useCallback } from "react";
import { GlobalContext } from "../../../../pages/_app";
import { DriveContext } from "../../Provider";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import InpuText from "../../../Input/Text/InputText";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import axios from "axios";

// Routes
import { RESPONSE } from "../../../../routes/index.routes";
import {
  createFolder,
  BODY_CREATE_FOLDER
} from "../../../../routes/drive.routes";

const AddFolder = () => {
  const { setArrayMsgs, selectedCompany } = useContext(GlobalContext);

  const {
    arrayFoldersTimeLine,
    selectedBucket,
    fetchDocuments,
    setModalPopUpAddFolder,
    modalPopUpAddFolder
  } = useContext(DriveContext);

  const [nameFolder, setNameFolder] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getFolderIdParent = useCallback((): number => {
    if (!arrayFoldersTimeLine) return 0;
    if (arrayFoldersTimeLine.length == 0) return 0;
    return arrayFoldersTimeLine[arrayFoldersTimeLine.length - 1].id;
  }, [arrayFoldersTimeLine]);

  const fetchAddFolder = useCallback(async () => {
    try {
      if (!selectedBucket || !selectedCompany) return;

      const body: BODY_CREATE_FOLDER = {
        name: nameFolder,
        folderId: getFolderIdParent(),
        bucketId: selectedBucket.id,
        companyId: selectedCompany.id
      };

      setIsLoading(true);

      const response = await axios.post(createFolder.url, body, {
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

      if (fetchDocuments && arrayFoldersTimeLine)
        fetchDocuments({ bucket: selectedBucket, arrayFoldersTimeLine });
      if (setModalPopUpAddFolder) setModalPopUpAddFolder(false);
      clean();
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
  }, [
    selectedBucket,
    selectedCompany,
    nameFolder,
    setModalPopUpAddFolder,
    fetchDocuments,
    arrayFoldersTimeLine,
    getFolderIdParent,
    setArrayMsgs
  ]);

  const clean = () => {
    setNameFolder("");
    setIsLoading(false);
  };

  return (
    <PopUpModal
      isModal={modalPopUpAddFolder}
      setIsModal={setModalPopUpAddFolder}
      callbackClose={clean}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div className={styles.folder_title}>Add folder</div>
        <InpuText
          text="Folder name"
          value={nameFolder}
          setValue={setNameFolder}
          id="input-folder-name"
          name="Folder name"
          type="text"
        />
        <div className={styles.folder}>
          <BtnSpinner
            text="Create"
            callback={fetchAddFolder}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-add-folder"
            isLoading={isLoading}
          />
        </div>
      </form>
    </PopUpModal>
  );
};

export default AddFolder;
