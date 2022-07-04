import { NextPage } from "next";
import Head from "next/head";

// Components
import Header from "../components/Landing/Header/Header";
import Product from "../components/Landing/Product/Product";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teamplace</title>
      </Head>
      <Header />
      <Product />
    </>
  );
};

export default Home;
