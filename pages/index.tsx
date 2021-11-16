import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Dashboard from "../components/dashboard";
import Footer from "../components/footer";

const Home = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: any) {
  return (
    <Layout>
      {page}
      <hr></hr>
    </Layout>
  );
};
