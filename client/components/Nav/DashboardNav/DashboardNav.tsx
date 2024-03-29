import styles from "./DashboardNav.module.scss";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Link from "next/link";

// Context
import { GlobalContext } from "../../../pages/_app";
import { DriveContext } from "../../../components/Drive/Provider";

import { getImage } from "../../../routes/cdn.routes";

// Animations
import { fadeVariants } from "../../../animations/fade";

// Icons
import ChevronDown from "../../Svgs/ChevronDown";
import Bell from "../../Svgs/Bell";
import Camera from "../../Svgs/Camera";

// Components
import Cmd from "./Cmd/Cmd";
import DropDown from "./DropDown/DropDown";

type Props = {
  rules: any;
};

export const DashBoardNavControls = ({ rules }: Props) => {
  const { user, selectedCompany } = useContext(GlobalContext);
  // State dropdown
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // Cleaning
  const {
    setArrayBuckets,
    setArrayDocuments,
    setArrayFoldersTimeLine,
    setArrayUsersInBucket,
    setIsLoadingBody,
    setSelectedBucket
  } = useContext(DriveContext);
  const cleanDrivesChache = () => {
    if (setArrayBuckets) setArrayBuckets([]);
    if (setArrayDocuments) setArrayDocuments({});
    if (setArrayFoldersTimeLine) setArrayFoldersTimeLine([]);
    if (setArrayUsersInBucket) setArrayUsersInBucket([]);
    if (setIsLoadingBody) setIsLoadingBody(false);
    if (setSelectedBucket) setSelectedBucket(undefined);
  };

  return (
    <div className={rules.nav_controls}>
      <div className={rules.nav_controls_cmd}>
        <Cmd />
      </div>
      <div className={rules.nav_controls_info}>
        {/* <div
          onClick={cleanDrivesChache}
          className={rules.nav_controls_info_bell}
        >
          <Bell />
        </div> */}
        <div className={rules.nav_controls_info_types}>
          {selectedCompany && selectedCompany.User_Company && (
            <>
              <div>{selectedCompany.User_Company.typeAccount}</div>
              <div>{selectedCompany.User_Company.typeUser}</div>
            </>
          )}
        </div>
        <div className={rules.nav_controls_info_user}>
          <Link href="/dashboard/profile">
            <a
              title="Go to Profile"
              onClick={cleanDrivesChache}
              className={rules.nav_controls_info_user_profile}
            >
              <div className={rules.nav_controls_info_user_profile_img}>
                <Camera />
                {user && user.profilePictureURL && (
                  <img
                    src={`${getImage.url(user.profilePictureURL)}`}
                    alt="Profile"
                  />
                )}
              </div>
              <div
                title={user ? user.globalUsername : ""}
                className={rules.nav_controls_info_user_profile_name}
              >
                {user && user.globalUsername}
              </div>
            </a>
          </Link>
          <div
            title="Toggle dropdown"
            tabIndex={-1}
            onBlur={() => {
              setIsDropDownOpen(false);
            }}
            className={rules.nav_controls_info_user_drop}
            onClick={() => {
              setIsDropDownOpen(true);
            }}
          >
            <ChevronDown />
            <DropDown isOpen={isDropDownOpen} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardNav = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);

  // Cleaning
  const {
    setArrayBuckets,
    setArrayDocuments,
    setArrayFoldersTimeLine,
    setArrayUsersInBucket,
    setIsLoadingBody,
    setSelectedBucket
  } = useContext(DriveContext);
  const cleanDrivesChache = () => {
    if (setArrayBuckets) setArrayBuckets([]);
    if (setArrayDocuments) setArrayDocuments({});
    if (setArrayFoldersTimeLine) setArrayFoldersTimeLine([]);
    if (setArrayUsersInBucket) setArrayUsersInBucket([]);
    if (setIsLoadingBody) setIsLoadingBody(false);
    if (setSelectedBucket) setSelectedBucket(undefined);
  };

  return (
    <motion.nav
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.nav}
    >
      <div className={styles.nav_logo}>
        <Link href="/">
          <a onClick={cleanDrivesChache}>Teamplace</a>
        </Link>
        <div
          onClick={() => {
            if (setIsMenuOpen) setIsMenuOpen(prev => !prev);
          }}
          className={`${styles.nav_responsive_top_hamburger} ${isMenuOpen &&
            styles.nav_responsive_top_hamburger_open}`}
          title="Toggle menu"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <DashBoardNavControls rules={styles} />
    </motion.nav>
  );
};

export default DashboardNav;
