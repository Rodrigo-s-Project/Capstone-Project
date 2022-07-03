import { NextPage } from "next";
import Head from "next/head";

// Components
import Header from "../components/Landing/Header/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teamplace</title>
      </Head>
      <Header />
    </>
  );
};

export default Home;
