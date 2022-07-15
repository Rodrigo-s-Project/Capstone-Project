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
import axios from "axios";

// Routes
import {
  getAllBuckets,
  DATA_GET_BUCKETS,
  DATA_GET_DOCUMENTS,
  getAllDocumentsFromBucket
} from "../../routes/drive.routes";
import { RESPONSE } from "../../routes/index.routes";

// Types
import { BUCKET, USER_BUCKET, FOLDER_TIMELINE } from "./drive.types";

type ParamsFetcherDocuments = {
  bucket: BUCKET;
};

export const DriveContext = createContext<Partial<DriveContextApp>>({});

interface DriveContextApp {
  arrayBuckets: Array<BUCKET>;
  setArrayBuckets: Dispatch<SetStateAction<Array<BUCKET>>>;
  arrayDocuments: Partial<DATA_GET_DOCUMENTS>;
  setArrayDocuments: Dispatch<SetStateAction<Partial<DATA_GET_DOCUMENTS>>>;
  arrayUsersInBucket: Array<USER_BUCKET>;
  setArrayUsersInBucket: Dispatch<SetStateAction<Array<USER_BUCKET>>>;
  arrayFoldersTimeLine: Array<FOLDER_TIMELINE>;
  setArrayFoldersTimeLine: Dispatch<SetStateAction<Array<FOLDER_TIMELINE>>>;
  isLoadingBody: boolean;
  setIsLoadingBody: Dispatch<SetStateAction<boolean>>;

  selectedBucket: BUCKET | undefined;
  setSelectedBucket: Dispatch<SetStateAction<BUCKET | undefined>>;
  fetchDocuments: ({  }: ParamsFetcherDocuments) => any;

  modalPopUpAddFolder: boolean;
  setModalPopUpAddFolder: Dispatch<SetStateAction<boolean>>;
}

type Props = {
  children: any;
};

const Provider = ({ children }: Props) => {
  const { selectedTeam, setArrayMsgs, selectedCompany } = useContext(
    GlobalContext
  );

  // State
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

  // Modal
  const [modalPopUpAddFolder, setModalPopUpAddFolder] = useState<boolean>(
    false
  );

  // Drive
  const [selectedBucket, setSelectedBucket] = useState<BUCKET | undefined>(
    undefined
  );

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
    async ({ bucket }: ParamsFetcherDocuments) => {
      try {
        setIsLoadingBody(true);

        if (!selectedCompany || !selectedTeam) return;

        const response = await axios.get(
          getAllDocumentsFromBucket.url(selectedTeam.id, bucket.id),
          {
            withCredentials: true
          }
        );

        setIsLoadingBody(false);

        const data: RESPONSE = response.data;
        const dataDocuments: DATA_GET_DOCUMENTS = data.data;

        if (setArrayDocuments)
          setArrayDocuments({
            files: dataDocuments.files,
            folders: dataDocuments.folders,
            users: dataDocuments.users
          });
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
        arrayDocuments,
        setArrayDocuments,
        arrayUsersInBucket,
        setArrayUsersInBucket,
        arrayFoldersTimeLine,
        setArrayFoldersTimeLine,
        isLoadingBody,
        setIsLoadingBody,
        arrayBuckets,
        setArrayBuckets,
        selectedBucket,
        setSelectedBucket,
        fetchDocuments,
        modalPopUpAddFolder,
        setModalPopUpAddFolder
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};
export default Provider;
