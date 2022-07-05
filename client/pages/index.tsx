import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

// Animations
import { fadeVariants } from "../animations/fade";

// Components
import Header from "../components/Landing/Header/Header";
import Product from "../components/Landing/Product/Product";

const Home: NextPage = () => {
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
