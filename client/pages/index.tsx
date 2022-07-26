import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./_app";

// Animations
import { fadeVariants } from "../animations/fade";

// Components
import Header from "../components/Landing/Header/Header";
import Product from "../components/Landing/Product/Product";

const Home: NextPage = () => {
  const { setSelectedCompany, setSelectedTeam } = useContext(GlobalContext);

  useEffect(() => {
    if (setSelectedCompany) setSelectedCompany(undefined);
    if (setSelectedTeam) setSelectedTeam(undefined);
  }, [setSelectedCompany, setSelectedTeam]);

  return (
    <>
      <Head>
        <title>Teamplace</title>
      </Head>
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="index-page"
      >
        <Header />
        <Product />
      </motion.div>
    </>
  );
};

export default Home;
