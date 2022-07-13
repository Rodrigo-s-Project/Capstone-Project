import styles from "./Aside.module.scss";
import { useContext } from "react";
import { DriveContext } from "../Drive";
import { GlobalContext } from "../../../pages/_app";
import { BUCKET } from "../drive.types";
import PlusIcon from "../../Svgs/Plus";
import BtnChildren from "../../Buttons/BtnChildren/BtnChildren";

const Teammates = () => {
  return <div>Teammates</div>;
};

const Buckets = () => {
  const { arrayBuckets } = useContext(DriveContext);
  const { selectedCompany } = useContext(GlobalContext);

  const addAWorkspace = () => {
    // TODO: add a workspace
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
