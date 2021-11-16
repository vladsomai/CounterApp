import Layout from "../components/layout";
import Dashboard from "../components/dashboard";

const Home = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
