import styles from "../../../Creation.module.scss";
import { useContext } from "react";
import { useRouter } from "next/router";

import { GlobalContext } from "../../../../../../../pages/_app";

import { TEAM } from "../../../../../../../routes/dashboard.team.routes";

// Icons
import Camera from "../../../../../../Svgs/Camera";

type Props = {
  team: TEAM;
};

const TeamCard = ({ team }: Props) => {
  const router = useRouter();
  const { selectedCompany } = useContext(GlobalContext);

  return (
    <div
      onClick={() => {
        router.replace(
          `/dashboard/${selectedCompany && selectedCompany.id}/team/${team.id}`
        );
      }}
      title={team.name}
      className={styles.creation_grid_join}
    >
      <div className={styles.creation_grid_profile}>
        <Camera />
      </div>
      <div className={styles.creation_grid_profile_name}>{team.name}</div>
    </div>
  );
};

export default TeamCard;
