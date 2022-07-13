import {
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
  useCallback
} from "react";
import { GlobalContext } from "../../pages/_app";
import styles from "./Drive.module.scss";
import axios from "axios";

// Components
import NavBarDrive from "./NavBar/NavBar";
import AsideDrive from "./Aside/Aside";
import BodyDrive from "./Body/Body";

// Routes
import {
  getAllBuckets,
  DATA_GET_BUCKETS,
  getAllDocumentsFromBucket,
  DATA_GET_DOCUMENTS,
  DOCUMENT_DATA as DOCUMENT
} from "../../routes/drive.routes";
import { RESPONSE } from "../../routes/index.routes";

// Types
import { BUCKET, USER_BUCKET, FOLDER_TIMELINE } from "./drive.types";

export const DriveContext = createContext<Partial<DriveContextApp>>({});

interface DriveContextApp {
  selectedBucket: BUCKET | undefined;
  setSelectedBucket: Dispatch<SetStateAction<BUCKET | undefined>>;
  arrayBuckets: Array<BUCKET>;
  setArrayBuckets: Dispatch<SetStateAction<Array<BUCKET>>>;
  arrayDocuments: Partial<DATA_GET_DOCUMENTS>;
  setArrayDocuments: Dispatch<SetStateAction<Partial<DATA_GET_DOCUMENTS>>>;
  arrayUsersInBucket: Array<USER_BUCKET>;
  setArrayUsersInBucket: Dispatch<SetStateAction<Array<USER_BUCKET>>>;
  arrayFoldersTimeLine: Array<FOLDER_TIMELINE>;
  setArrayFoldersTimeLine: Dispatch<SetStateAction<Array<FOLDER_TIMELINE>>>;
  refetchDocuments: (bucket: BUCKET) => any;
  isLoadingBody: boolean;
  setIsLoadingBody: Dispatch<SetStateAction<boolean>>;
}

const Drive = () => {
  const { selectedTeam, setArrayMsgs, selectedCompany } = useContext(
    GlobalContext
  );

  // State
  const [selectedBucket, setSelectedBucket] = useState<BUCKET | undefined>(
    undefined
  );
  const [arrayBuckets, setArrayBuckets] = useState<Array<BUCKET>>([]);
  const [arrayDocuments, setArrayDocuments] = useState<
    Partial<DATA_GET_DOCUMENTS>
  >({});
  const [arrayUsersInBucket, setArrayUsersInBucket] = useState<
    Array<USER_BUCKET>
  >([]);

  const [arrayFoldersTimeLine, setArrayFoldersTimeLine] = useState<
    Array<FOLDER_TIMELINE>
  >([]);
  const [isLoadingBody, setIsLoadingBody] = useState<boolean>(true);

  const fetchBuckets = useCallback(async () => {
    try {
      setIsLoadingBody(true);

      if (!selectedCompany || !selectedTeam) return;

      const response = await axios.get(
        getAllBuckets.url(selectedCompany.id, selectedTeam.id),
        {
          withCredentials: true
        }
      );

      const data: RESPONSE = response.data;
      const dataBuckets: DATA_GET_BUCKETS = data.data;

      setArrayBuckets(dataBuckets.buckets);
      setIsLoadingBody(false);
    } catch (error) {
      console.error(error);
      setIsLoadingBody(false);

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
  }, [selectedCompany, selectedTeam, setArrayMsgs]);

  useEffect(() => {
    fetchBuckets();
  }, [selectedCompany, selectedTeam, fetchBuckets]);

  const fetchDocuments = useCallback(
    async (bucket: BUCKET) => {
      try {
        setIsLoadingBody(true);

        if (!selectedCompany || !selectedTeam) return;

        const response = await axios.get(
          getAllDocumentsFromBucket.url(selectedTeam.id, bucket.id),
          {
            withCredentials: true
          }
        );

        const data: RESPONSE = response.data;
        const dataDocuments: DATA_GET_DOCUMENTS = data.data;

        setArrayDocuments({
          files: dataDocuments.files,
          folders: dataDocuments.folders,
          users: dataDocuments.users
        });
        setIsLoadingBody(false);
      } catch (error) {
        console.error(error);
        setIsLoadingBody(false);

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
    },
    [selectedCompany, selectedTeam, setArrayMsgs]
  );

  return (
    <DriveContext.Provider
      value={{
        selectedBucket,
        setSelectedBucket,
        arrayDocuments,
        setArrayDocuments,
        arrayUsersInBucket,
        setArrayUsersInBucket,
        arrayFoldersTimeLine,
        setArrayFoldersTimeLine,
        refetchDocuments: fetchDocuments,
        isLoadingBody,
        setIsLoadingBody,
        arrayBuckets,
        setArrayBuckets
      }}
    >
      <div className={styles.drive}>
        <h1>{selectedTeam && selectedTeam.name}&apos;s Workspace</h1>
        <div className={styles.drive_wrapper}>
          <div className={styles.drive_container}>
            <NavBarDrive />
            <BodyDrive />
          </div>
          <div className={styles.drive_aside}>
            <AsideDrive />
          </div>
        </div>
      </div>
    </DriveContext.Provider>
  );
};
export default Drive;
