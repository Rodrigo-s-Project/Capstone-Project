import styles from "./EditBucket.module.scss";
import { useContext, useState, useCallback, useEffect } from "react";
import { GlobalContext } from "../../../../pages/_app";
import { DriveContext } from "../../Provider";
import PopUpModal from "../../../Modals/PopUp/PopUp";
import InpuText from "../../../Input/Text/InputText";
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";
import axios from "axios";

// Routes
import { RESPONSE } from "../../../../routes/index.routes";
import {
  editBucket,
  BODY_EDIT_BUCKET,
  deleteBucket as deleteBucketEndpoint,
  BODY_DELETE_BUCKET
} from "../../../../routes/drive.routes";

const EditBucket = () => {
  const { setArrayMsgs, selectedCompany, selectedTeam } = useContext(
    GlobalContext
  );

  const {
    modalPopUpEditBucket,
    setModalPopUpEditBucket,
    fetchBuckets,
    selectedBucket,
    setSelectedBucket,
    setArrayFoldersTimeLine,
    setArrayDocuments
  } = useContext(DriveContext);

  const [nameBucket, setNameBucket] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (modalPopUpEditBucket && selectedBucket) {
      setNameBucket(selectedBucket.name);
    }
  }, [modalPopUpEditBucket, selectedBucket]);

  const fetchEditBucket = useCallback(async () => {
    try {
      if (!selectedTeam || !selectedCompany || !selectedBucket) return;

      const body: BODY_EDIT_BUCKET = {
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        bucketId: selectedBucket.id,
        name: nameBucket
      };

      setIsLoading(true);

      const response = await axios.put(editBucket.url, body, {
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

      if (setSelectedBucket) {
        setSelectedBucket({
          id: selectedBucket.id,
          name: nameBucket,
          teamId: selectedBucket.teamId
        });
      }
      if (setModalPopUpEditBucket) setModalPopUpEditBucket(false);
      if (fetchBuckets) fetchBuckets();
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
    setModalPopUpEditBucket,
    setArrayMsgs,
    selectedTeam,
    setSelectedBucket,
    fetchBuckets,
    selectedBucket
  ]);

  const deleteBucket = useCallback(async () => {
    try {
      if (!selectedTeam || !selectedCompany || !selectedBucket) return;

      const body: BODY_DELETE_BUCKET = {
        teamId: selectedTeam.id,
        companyId: selectedCompany.id,
        bucketId: selectedBucket.id
      };

      setIsLoading(true);

      const response = await axios.put(deleteBucketEndpoint.url, body, {
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

      if (
        setSelectedBucket &&
        setArrayFoldersTimeLine &&
        setArrayDocuments &&
        setModalPopUpEditBucket &&
        fetchBuckets
      ) {
        setModalPopUpEditBucket(false);
        setArrayFoldersTimeLine([]);
        setArrayDocuments({});
        setSelectedBucket(undefined);
        fetchBuckets();
      }
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
    setModalPopUpEditBucket,
    fetchBuckets,
    setArrayMsgs,
    selectedTeam,
    setArrayDocuments,
    setArrayFoldersTimeLine,
    selectedBucket,
    setSelectedBucket,
  ]);

  const clean = () => {
    setNameBucket("");
    setIsLoading(false);
    setIsDeleting(false);
  };

  return (
    <PopUpModal
      isModal={modalPopUpEditBucket}
      setIsModal={setModalPopUpEditBucket}
      callbackClose={clean}
    >
      {!isDeleting && (
        <>
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <div className={styles.bucket_title}>Edit workspace</div>
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
                text="Edit workspace"
                callback={fetchEditBucket}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-edit-bucket"
                isLoading={isLoading}
              />
            </div>
          </form>
          <div className={styles.bucket}>
            <BtnSpinner
              text="Delete workspace"
              callback={() => {
                if (!isLoading) setIsDeleting(true);
              }}
              color="gray"
              border="round_5"
              additionalClass="btn-delete-bucket"
              isLoading={isLoading}
            />
          </div>
        </>
      )}
      {isDeleting && (
        <div>
          <div className={styles.bucket}>
            <div>Are you sure you want to delete this workspace?</div>
            <BtnSpinner
              text="Delete workspace"
              callback={deleteBucket}
              color="lavender-300"
              border="round_5"
              additionalClass="btn-edit-bucket"
              isLoading={isLoading}
            />
            <BtnSpinner
              text="Cancel"
              callback={() => {
                if (!isLoading) setIsDeleting(false);
              }}
              color="gray"
              border="round_5"
              additionalClass="btn-edit-bucket"
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </PopUpModal>
  );
};

export default EditBucket;
