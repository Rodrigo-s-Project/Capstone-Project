import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../../../animations/fade";

// Componnets
import DashboardWrapper from "../../../../../components/Dashboard/Dashboard";
import TeamWrapper from "../../../../../components/Dashboard/Body/Creation/Teams/Wrapper";
import Calendar from "../../../../../components/Calendar/Calendar";

const Dashboard: NextPage = () => {
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
          <TeamWrapper>
            <Calendar />
          </TeamWrapper>
        </DashboardWrapper>
      </motion.div>
    </>
  );
};

export default Dashboard;
