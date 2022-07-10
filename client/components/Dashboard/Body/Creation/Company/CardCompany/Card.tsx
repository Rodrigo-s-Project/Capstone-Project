import styles from "../../Creation.module.scss";
import { useRouter } from "next/router";

// Icons
import Camera from "../../../../../Svgs/Camera";

import { COMPANY } from "../../../../../../routes/dashboard.company.routes";

type Props = {
  company: COMPANY;
};

const CompanyCard = ({ company }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.replace(`/dashboard/${company.id}`);
      }}
      title={company.name}
      className={styles.creation_grid_join}
    >
      <div className={styles.creation_grid_profile}>
        <Camera />
      </div>
      <div className={styles.creation_grid_profile_name}>{company.name}</div>
    </div>
  );
};

export default CompanyCard;
