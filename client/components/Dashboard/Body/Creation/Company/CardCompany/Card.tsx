import styles from "../../Creation.module.scss";
import { useRouter } from "next/router";

// Icons
import Camera from "../../../../../Svgs/Camera";
import { getImage } from "../../../../../../routes/cdn.routes";

import { COMPANY } from "../../../../../../routes/dashboard.company.routes";

type Props = {
  company: COMPANY;
};

const CompanyCard = ({ company }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.replace(`/dashboard/${company.id}/teams`);
      }}
      title={company.name}
      className={styles.creation_grid_join}
    >
      <div className={styles.creation_grid_profile}>
        <Camera />
        {company.companyPictureURL && company.companyPictureURL != "" && (
          <img
            src={`${getImage.url(company.companyPictureURL)}`}
            alt={company.name}
          />
        )}
      </div>
      <div className={styles.creation_grid_profile_name}>{company.name}</div>
    </div>
  );
};

export default CompanyCard;
