import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../animations/fade";

// Componnets
import DashboardWrapper from "../../../components/Dashboard/Dashboard";
import Teams from "../../../components/Dashboard/Body/Creation/Teams/Join/Teams";

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
          <Teams />
        </DashboardWrapper>
      </motion.div>
    </>
  );
};

export default Dashboard;
