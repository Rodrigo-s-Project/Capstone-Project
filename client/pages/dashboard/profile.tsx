import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../animations/fade";

// Componnets
import DashboardWrapper from "../../components/Dashboard/Dashboard";
import Profile from "../../components/Profile/Profile";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teamplace | Profile</title>
      </Head>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="dashboard-page"
      >
        <DashboardWrapper>
          <Profile />
        </DashboardWrapper>
      </motion.div>
    </>
  );
};

export default Dashboard;
