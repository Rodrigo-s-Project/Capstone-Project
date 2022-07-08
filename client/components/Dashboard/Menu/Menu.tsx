import styles from "./Menu.module.scss";
import stylesNav from "../../Nav/DashboardNav/DashboardNav.module.scss";
import { useContext, Fragment } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants } from "../../../animations/fade";

// Context
import { GlobalContext } from "../../../pages/_app";

// Components
import { DashBoardNavControls } from "../../Nav/DashboardNav/DashboardNav";

// Icons
import BriefcaseIcon from "../../Svgs/Briefcase";
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

const MenuDashboard = () => {
  const {
    isMenuOpen,
    setSelectedCompany,
    setSelectedTeam,
    selectedCompany,
    selectedTeam
  } = useContext(GlobalContext);
  const router = useRouter();

  return (
    <aside className={`${styles.menu} ${isMenuOpen && styles.menu_open}`}>
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
            if (setSelectedCompany) setSelectedCompany(undefined);
            if (setSelectedTeam) setSelectedTeam(undefined);
            router.replace("/dashboard");
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
                  className={styles.selected_company}
                >
                  {selectedCompany.name}
                </motion.div>
                <LinkMenu
                  isActive={
                    router.pathname.includes("/dashboard") &&
                    !router.pathname.includes("/messages") &&
                    !router.pathname.includes("/calendar") &&
                    !router.pathname.includes("/team")
                  }
                  text="Teams"
                  click={() => {
                    router.replace(`/dashboard/${selectedCompany.id}`);
                    if (setSelectedTeam) setSelectedTeam(undefined);
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
                  className={styles.selected_company}
                >
                  {selectedTeam.name}
                </motion.div>
                <LinkMenu
                  isActive={
                    router.pathname.includes("/team") &&
                    !router.pathname.includes("/messages") &&
                    !router.pathname.includes("/calendar")
                  }
                  text="Drive"
                  click={() => {
                    if (selectedTeam)
                      router.replace(
                        `/dashboard/${selectedCompany.id}/team/${selectedTeam.id}`
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
                  <BriefcaseIcon />
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
                  <BriefcaseIcon />
                </LinkMenu>
              </>
            ) : null}
          </Fragment>
        </AnimatePresence>

        {/* Settings */}
        <LinkMenu
          isActive={router.pathname == "/settings"}
          text="Settings"
          click={() => {}}
        >
          <CogIcon />
        </LinkMenu>
      </div>
    </aside>
  );
};

export default MenuDashboard;
