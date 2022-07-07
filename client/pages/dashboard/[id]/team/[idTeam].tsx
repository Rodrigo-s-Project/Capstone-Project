import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../../animations/fade";

// Componnets
import DashboardWrapper from "../../../../components/Dashboard/Dashboard";
import TeamWrapper from "../../../../components/Dashboard/Body/Teams/Wrapper";

import { useContext } from "react";
import { GlobalContext } from "../../../_app";

const Dashboard: NextPage = () => {
  const { selectedTeam } = useContext(GlobalContext);

  return (
    <>
      <Head>
        <title>Teamplace | Dashboard</title>
      </Head>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="dashboard-page"
      >
        <DashboardWrapper>
          <TeamWrapper>{selectedTeam && selectedTeam.name}</TeamWrapper>
        </DashboardWrapper>
      </motion.div>
    </>
  );
};

export default Dashboard;
