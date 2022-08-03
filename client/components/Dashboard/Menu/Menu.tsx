import styles from "./Menu.module.scss";
import stylesNav from "../../Nav/DashboardNav/DashboardNav.module.scss";
import { useContext, Fragment, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants } from "../../../animations/fade";

// Context
import { GlobalContext } from "../../../pages/_app";
import { DriveContext } from "../../../components/Drive/Provider";

// Components
import { DashBoardNavControls } from "../../Nav/DashboardNav/DashboardNav";

// Icons
import BriefcaseIcon from "../../Svgs/Briefcase";
import CommentIcon from "../../Svgs/Comment";
import CalendarAltIcon from "../../Svgs/CalendarAlt";
import CogIcon from "../../Svgs/Cog";
import FileInvoiceIcon from "../../Svgs/FileInvoice";

type Props = {
  text: string;
  click: () => any;
  children: any;
  isActive: boolean;
};

const LinkMenu = ({ text, click, children, isActive }: Props) => {
  return (
    <div className={styles.menu_links_link} onClick={click}>
      <div
        className={`${styles.menu_links_link_svg} ${isActive && styles.active}`}
      >
        {children}
      </div>
      <div
        className={`${styles.menu_links_link_text} ${isActive &&
          styles.active}`}
      >
        {text}
      </div>
    </div>
  );
};

type PropsMenu = {
  isMenuToggled: boolean;
  setIsMenuToggleVisible: Dispatch<SetStateAction<boolean>>;
};

const MenuDashboard = ({
  isMenuToggled,
  setIsMenuToggleVisible
}: PropsMenu) => {
  const {
    isMenuOpen,
    setSelectedCompany,
    setSelectedTeam,
    selectedCompany,
    selectedTeam
  } = useContext(GlobalContext);
  const router = useRouter();

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
    <aside
      className={`${styles.menu} ${isMenuOpen &&
        styles.menu_open} ${isMenuToggled && styles.menu_toggled}`}
      onMouseEnter={() => {
        setIsMenuToggleVisible(true);
      }}
      onMouseLeave={() => {
        setIsMenuToggleVisible(false);
      }}
    >
      <div className={styles.menu_nav}>
        <div className={styles.menu_nav_title}>Menu</div>
        <DashBoardNavControls
          rules={{
            ...stylesNav,
            ...styles
          }}
        />
      </div>
      <div className={styles.menu_links}>
        {/* Companies Array */}
        <LinkMenu
          isActive={router.pathname == "/dashboard"}
          text="Companies"
          click={() => {
            // First travel
            router.replace("/dashboard");

            if (setSelectedCompany) setSelectedCompany(undefined);
            if (setSelectedTeam) setSelectedTeam(undefined);
            cleanDrivesChache();
          }}
        >
          <BriefcaseIcon />
        </LinkMenu>

        {/* Controls */}
        <AnimatePresence exitBeforeEnter>
          <Fragment key="menu-controls">
            {selectedCompany ? (
              <>
                <motion.div
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`${
                    styles.selected_company
                  } ${router.pathname.includes("/dashboard") &&
                    !router.pathname.includes("/team") &&
                    !router.pathname.includes("/messages") &&
                    !router.pathname.includes("/calendar") &&
                    !router.pathname.includes("/drive") &&
                    styles.selected_company_active}`}
                  onClick={() => {
                    router.replace(`/dashboard/${selectedCompany.id}`);

                    if (setSelectedTeam) setSelectedTeam(undefined);
                    cleanDrivesChache();
                  }}
                >
                  {selectedCompany.name}
                </motion.div>
                <LinkMenu
                  isActive={router.pathname.includes("/teams")}
                  text="Teams"
                  click={() => {
                    router.replace(`/dashboard/${selectedCompany.id}/teams`);

                    if (setSelectedTeam) setSelectedTeam(undefined);
                    cleanDrivesChache();
                  }}
                >
                  <BriefcaseIcon />
                </LinkMenu>
              </>
            ) : null}

            {selectedTeam && selectedCompany ? (
              <>
                <motion.div
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`${
                    styles.selected_company
                  } ${router.pathname.includes("/team") &&
                    !router.pathname.includes("/teams") &&
                    !router.pathname.includes("/drive") &&
                    !router.pathname.includes("/messages") &&
                    !router.pathname.includes("/calendar") &&
                    styles.selected_company_active}`}
                  onClick={() => {
                    router.replace(
                      `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}`
                    );
                  }}
                >
                  {selectedTeam.name}
                </motion.div>
                <LinkMenu
                  isActive={router.pathname.includes("/drive")}
                  text="Drive"
                  click={() => {
                    if (selectedTeam)
                      router.replace(
                        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/drive`
                      );
                  }}
                >
                  <FileInvoiceIcon />
                </LinkMenu>
                <LinkMenu
                  isActive={router.pathname.includes("/messages")}
                  text="Messages"
                  click={() => {
                    if (selectedTeam)
                      router.replace(
                        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/messages`
                      );
                  }}
                >
                  <CommentIcon />
                </LinkMenu>
                <LinkMenu
                  isActive={router.pathname.includes("/calendar")}
                  text="Calendar"
                  click={() => {
                    if (selectedTeam)
                      router.replace(
                        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}/calendar`
                      );
                  }}
                >
                  <CalendarAltIcon />
                </LinkMenu>
              </>
            ) : null}
          </Fragment>
        </AnimatePresence>

        {/* Settings */}
        <LinkMenu
          isActive={router.pathname == "/dashboard/settings"}
          text="Settings"
          click={() => {
            router.replace(`/dashboard/settings`);

            if (setSelectedCompany) setSelectedCompany(undefined);
            if (setSelectedTeam) setSelectedTeam(undefined);
            cleanDrivesChache();
          }}
        >
          <CogIcon />
        </LinkMenu>
      </div>
    </aside>
  );
};

export default MenuDashboard;
