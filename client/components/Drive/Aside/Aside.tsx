import styles from "./Aside.module.scss";
import { useContext, Fragment } from "react";
import { DriveContext } from "../Provider";
import { GlobalContext } from "../../../pages/_app";
import { BUCKET } from "../drive.types";
import { USER_WORKSPACE_ASIDE } from "../../../routes/drive.routes";
import BtnChildren from "../../Buttons/BtnChildren/BtnChildren";

// Icons
import PlusIcon from "../../Svgs/Plus";
import ChevronLeftIcon from "../../Svgs/ChevronLeft";
import CameraIcon from "../../Svgs/Camera";

// Routes
import { getImage } from "../../../routes/cdn.routes";

const User = ({ userRef }: { userRef: USER_WORKSPACE_ASIDE }) => {
  return (
    <div className={styles.aside_user}>
      <div className={styles.aside_user_img}>
        <CameraIcon />
        {userRef.profilePictureURL && (
          <img
            src={`${getImage.url(userRef.profilePictureURL)}`}
            alt={userRef.username}
          />
        )}
      </div>
      <div className={styles.aside_user_name}>{userRef.username}</div>
    </div>
  );
};

const YouAreAnEmployee = () => {
  const { arrayDocuments } = useContext(DriveContext);
  const { user } = useContext(GlobalContext);

  return (
    <div className={styles.aside_group}>
      {/* Here are the teammates */}
      <div className={styles.aside_group_wrapper}>
        <div className={styles.aside_group_title}>Teammates</div>
        <div className={styles.aside_array_list}>
          {arrayDocuments &&
            arrayDocuments.users &&
            arrayDocuments.users.map(
              (userRef: USER_WORKSPACE_ASIDE, index: number) => {
                if (user && userRef.id == user.id) return null;
                if (
                  userRef.typeUser == "Admin" ||
                  userRef.typeUser == "Employee"
                ) {
                  return (
                    <Fragment key={index}>
                      <User userRef={userRef} />
                    </Fragment>
                  );
                }
                return null;
              }
            )}
        </div>
      </div>

      {/* Here are the clients */}
      <div className={styles.aside_group_wrapper}>
        <div className={styles.aside_group_title}>Clients</div>
        <div className={styles.aside_array_list}>
          {arrayDocuments &&
            arrayDocuments.users &&
            arrayDocuments.users.map(
              (userRef: USER_WORKSPACE_ASIDE, index: number) => {
                if (user && userRef.id == user.id) return null;
                if (userRef.typeUser == "Client") {
                  return (
                    <Fragment key={index}>
                      <User userRef={userRef} />
                    </Fragment>
                  );
                }
                return null;
              }
            )}
        </div>
      </div>
    </div>
  );
};

const YouAreAClient = () => {
  const { arrayDocuments } = useContext(DriveContext);
  const { user, selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.aside_group}>
      {/* Here are the employees */}
      <div className={styles.aside_group_wrapper}>
        <div className={styles.aside_group_title}>
          {selectedTeam && selectedTeam.name}
        </div>
        <div className={styles.aside_array_list}>
          {arrayDocuments &&
            arrayDocuments.users &&
            arrayDocuments.users.map(
              (userRef: USER_WORKSPACE_ASIDE, index: number) => {
                if (user && userRef.id == user.id) return null;
                if (
                  userRef.typeUser == "Admin" ||
                  userRef.typeUser == "Employee"
                ) {
                  return (
                    <Fragment key={index}>
                      <User userRef={userRef} />
                    </Fragment>
                  );
                }
                return null;
              }
            )}
        </div>
      </div>

      {/* Here are the teammates */}
      <div className={styles.aside_group_wrapper}>
        <div className={styles.aside_group_title}>Teammates</div>
        <div className={styles.aside_array_list}>
          {arrayDocuments &&
            arrayDocuments.users &&
            arrayDocuments.users.map(
              (userRef: USER_WORKSPACE_ASIDE, index: number) => {
                if (user && userRef.id == user.id) return null;
                if (userRef.typeUser == "Client") {
                  return (
                    <Fragment key={index}>
                      <User userRef={userRef} />
                    </Fragment>
                  );
                }
                return null;
              }
            )}
        </div>
      </div>
    </div>
  );
};

const Teammates = () => {
  const { selectedCompany } = useContext(GlobalContext);

  const {
    setSelectedBucket,
    selectedBucket,
    setArrayFoldersTimeLine,
    setArrayDocuments
  } = useContext(DriveContext);

  const returnToNoWorkspace = () => {
    if (setSelectedBucket && setArrayFoldersTimeLine && setArrayDocuments) {
      setArrayFoldersTimeLine([]);
      setArrayDocuments({});
      setSelectedBucket(undefined);
    }
  };

  return (
    <div className={styles.aside_array_users}>
      <div className={styles.aside_array_top_title}>
        <div
          onClick={returnToNoWorkspace}
          title="Return"
          className={styles.aside_array_top_title_return}
        >
          <ChevronLeftIcon />
        </div>
        <div className={styles.aside_array_top_title_text}>
          {selectedBucket && selectedBucket.name}
        </div>
      </div>
      {selectedCompany &&
        (selectedCompany.User_Company.typeUser == "Admin" ||
          selectedCompany.User_Company.typeUser == "Employee") && (
          <YouAreAnEmployee />
        )}
      {selectedCompany && selectedCompany.User_Company.typeUser == "Client" && (
        <YouAreAClient />
      )}
    </div>
  );
};

const Buckets = () => {
  const {
    arrayBuckets,
    setSelectedBucket,
    fetchDocuments,
    arrayFoldersTimeLine
  } = useContext(DriveContext);

  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);

  const addAWorkspace = () => {
    // TODO: add a workspace
    if (setArrayMsgs)
      setArrayMsgs(prev => [
        {
          type: "info",
          text: "Feature not available..."
        },
        ...prev
      ]);
  };

  const clickWorkspace = (bucket: BUCKET) => {
    if (fetchDocuments && setSelectedBucket && arrayFoldersTimeLine) {
      setSelectedBucket(bucket);
      fetchDocuments({ bucket, arrayFoldersTimeLine });
    }
  };

  return (
    <div className={styles.aside_array}>
      <div className={styles.aside_array_top}>
        <div className={styles.aside_array_top_title}>Workspaces</div>
        {selectedCompany &&
          (selectedCompany.User_Company.typeUser == "Admin" ||
            selectedCompany.User_Company.typeUser == "Employee") && (
            <BtnChildren
              callback={addAWorkspace}
              color="gray"
              border="complete_rounded"
              additionalClass="btn-add-workspace"
              title="Add a workspace"
            >
              <PlusIcon />
            </BtnChildren>
          )}
      </div>
      <div className={styles.aside_array_list}>
        {arrayBuckets &&
          arrayBuckets.map((bucket: BUCKET, index: number) => {
            return (
              <div
                title="Select workspace"
                className={styles.aside_bucket}
                key={index}
                onClick={() => {
                  clickWorkspace(bucket);
                }}
              >
                {bucket.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const AsideDrive = () => {
  const { selectedBucket } = useContext(DriveContext);

  return (
    <div className={styles.aside}>
      {selectedBucket && <Teammates />}
      {!selectedBucket && <Buckets />}
    </div>
  );
};

export default AsideDrive;
