import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../animations/fade";

// Components
import LogInCard from "../components/LogIn/LogInCard/LogInCard";

const LogIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teamplace | Log In</title>
      </Head>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="log-in-page"
      >
        <LogInCard />
      </motion.div>
    </>
  );
};

export default LogIn;
