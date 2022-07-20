import styles from "../../../Creation.module.scss";
import { useContext } from "react";
import { useRouter } from "next/router";

import { GlobalContext } from "../../../../../../../pages/_app";
import { getImage } from "../../../../../../../routes/cdn.routes";

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
          `/dashboard/${selectedCompany && selectedCompany.id}/team/${team.id}/drive`
        );
      }}
      title={team.name}
      className={styles.creation_grid_join}
    >
      <div className={styles.creation_grid_profile}>
        <Camera />
        {team.teamPictureURL && team.teamPictureURL != "" && (
          <img src={`${getImage.url(team.teamPictureURL)}`} alt={team.name} />
        )}
      </div>
      <div className={styles.creation_grid_profile_name}>{team.name}</div>
    </div>
  );
};

export default TeamCard;
