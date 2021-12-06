import Layout from "../components/layout";
import Dashboard from "../components/dashboard";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
