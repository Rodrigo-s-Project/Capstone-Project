import { NextPage } from "next";
import Head from "next/head";
import { useContext } from "react";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../animations/fade";

// Context
import { GlobalContext } from "./_app";

const Dashboard: NextPage = () => {
  const { user } = useContext(GlobalContext);

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
        Welcome {user && user.globalUsername} to your Dashboard!
      </motion.div>
    </>
  );
};

export default Dashboard;
