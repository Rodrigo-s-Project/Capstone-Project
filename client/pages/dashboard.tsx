import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../animations/fade";

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
        Welcome to Dashboard
      </motion.div>
    </>
  );
};

export default Dashboard;
