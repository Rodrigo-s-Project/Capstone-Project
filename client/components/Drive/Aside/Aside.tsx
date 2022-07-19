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
import TrashAltIcon from "../../Svgs/TrashAlt";
import EditIcon from "../../Svgs/Edit";

// Routes
import { getImage } from "../../../routes/cdn.routes";

const User = ({ userRef }: { userRef: USER_WORKSPACE_ASIDE }) => {
  const { selectedCompany, setArrayMsgs } = useContext(GlobalContext);

  const canEdit = (): boolean => {
    if (!selectedCompany) return false;
    if (userRef.typeUser == "Admin" || userRef.typeUser == "Employee")
      return false;
    return (
      selectedCompany.User_Company.typeUser == "Admin" ||
      selectedCompany.User_Company.typeUser == "Employee"
    );
  };

  const kickUser = () => {
    if (setArrayMsgs)
      setArrayMsgs(prev => [
        {
          type: "info",
          text: "Feature not available..."
        },
        ...prev
      ]);
  };

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
      {canEdit() && (
        <div
          title="Kick user from workspace"
          className={styles.aside_user_delete}
          onClick={kickUser}
        >
          <TrashAltIcon />
        </div>
      )}
    </div>
  );
};

type Props = {
  typeUser: Array<string>;
  title: string;
};

const ListAside = ({ typeUser, title }: Props) => {
  const { arrayDocuments } = useContext(DriveContext);
  const { user } = useContext(GlobalContext);

  const getList = () => {
    let aux: Array<USER_WORKSPACE_ASIDE> = [];
    if (!arrayDocuments || !arrayDocuments.users) return [];
    if (!user) return [];

    for (let i = 0; i < arrayDocuments.users.length; i++) {
      if (
        typeUser.includes(arrayDocuments.users[i].typeUser) &&
        user.id != arrayDocuments.users[i].id
      ) {
        aux.push(arrayDocuments.users[i]);
      }
    }
    return aux;
  };

  return (
    <div className={styles.aside_group_wrapper}>
      <div className={styles.aside_group_title}>{title}</div>
      {getList().length == 0 && (
        <div className={styles.aside_array_zero}>
          <div></div>
        </div>
      )}
      {getList().length > 0 && (
        <div className={styles.aside_array_list}>
          {getList().map((userRef: USER_WORKSPACE_ASIDE, index: number) => {
            return (
              <Fragment key={index}>
                <User userRef={userRef} />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

const YouAreAnEmployee = () => {
  return (
    <div className={styles.aside_group}>
      {/* Here are the teammates */}
      <ListAside title="Teammates" typeUser={["Admin", "Employee"]} />
      {/* Here are the clients */}
      <ListAside title="Clients" typeUser={["Client"]} />
    </div>
  );
};

const YouAreAClient = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <div className={styles.aside_group}>
      {/* Here are the employees */}
      <ListAside
        title={selectedTeam ? selectedTeam.name : "Team"}
        typeUser={["Admin", "Employee"]}
      />
      {/* Here are the teammates */}
      <ListAside title="Teammates" typeUser={["Client"]} />
    </div>
  );
};

const Teammates = () => {
  const { selectedCompany } = useContext(GlobalContext);

  const {
    setSelectedBucket,
    selectedBucket,
    setArrayFoldersTimeLine,
    setArrayDocuments,
    setModalPopUpEditBucket
  } = useContext(DriveContext);

  const returnToNoWorkspace = () => {
    if (setSelectedBucket && setArrayFoldersTimeLine && setArrayDocuments) {
      setArrayFoldersTimeLine([]);
      setArrayDocuments({});
      setSelectedBucket(undefined);
    }
  };

  const editWorkspace = () => {
    if (setModalPopUpEditBucket) setModalPopUpEditBucket(true);
  };

  return (
    <div className={styles.aside_array_users}>
      <div className={styles.aside_array_top}>
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
          {selectedCompany &&
            (selectedCompany.User_Company.typeUser == "Admin" ||
              selectedCompany.User_Company.typeUser == "Employee") &&
            selectedBucket &&
            selectedBucket.name != "Main directory" && (
              <div
                onClick={editWorkspace}
                title="Edit"
                className={styles.aside_array_top_title_edit}
              >
                <EditIcon />
              </div>
            )}
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
    arrayFoldersTimeLine,
    setModalPopUpAddBucket
  } = useContext(DriveContext);

  const { selectedCompany } = useContext(GlobalContext);

  const addAWorkspace = () => {
    if (setModalPopUpAddBucket) setModalPopUpAddBucket(true);
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
