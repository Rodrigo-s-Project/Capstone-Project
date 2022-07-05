import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../animations/fade";

// Components
import SignUpComponent from "../components/Auth/SignUp/SignUp";

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teamplace | Sign up</title>
      </Head>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="sign-up-page"
      >
        <SignUpComponent />
      </motion.div>
    </>
  );
};

export default SignUp;
