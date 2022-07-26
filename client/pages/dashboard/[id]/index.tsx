import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../../../animations/fade";

// Componnets
import DashboardWrapper from "../../../components/Dashboard/Dashboard";
import CompanyControl from "../../../components/Controls/Company/Company";

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
          <CompanyControl />
        </DashboardWrapper>
      </motion.div>
    </>
  );
};

export default Dashboard;
