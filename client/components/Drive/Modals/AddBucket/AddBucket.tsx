import styles from "./AddBucket.module.scss";
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
  createBucket,
  BODY_CREATE_BUCKET
} from "../../../../routes/drive.routes";

const AddBucket = () => {
  const { setArrayMsgs, selectedCompany, selectedTeam } = useContext(
    GlobalContext
  );

  const {
    modalPopUpAddBucket,
    setModalPopUpAddBucket,
    fetchBuckets
  } = useContext(DriveContext);

  const [nameBucket, setNameBucket] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAddBucket = useCallback(async () => {
    try {
      if (!selectedTeam || !selectedCompany) return;

      const body: BODY_CREATE_BUCKET = {
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        name: nameBucket
      };

      setIsLoading(true);

      const response = await axios.post(createBucket.url, body, {
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

      if (fetchBuckets) fetchBuckets();
      if (setModalPopUpAddBucket) setModalPopUpAddBucket(false);
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
    selectedCompany,
    nameBucket,
    setModalPopUpAddBucket,
    fetchBuckets,
    setArrayMsgs,
    selectedTeam
  ]);

  const clean = () => {
    setNameBucket("");
    setIsLoading(false);
  };

  return (
    <PopUpModal
      isModal={modalPopUpAddBucket}
      setIsModal={setModalPopUpAddBucket}
      callbackClose={clean}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div className={styles.bucket_title}>Add workspace</div>
        <InpuText
          text="Workspace name"
          value={nameBucket}
          setValue={setNameBucket}
          id="input-bucket-name"
          name="Workspace name"
          type="text"
        />
        <div className={styles.bucket}>
          <BtnSpinner
            text="Create"
            callback={fetchAddBucket}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-add-bucket"
            isLoading={isLoading}
          />
        </div>
      </form>
    </PopUpModal>
  );
};

export default AddBucket;
