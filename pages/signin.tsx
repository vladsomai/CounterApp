import Layout from "../components/layout";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Signin = () => {
  return (
      <>
      <p className="text-light display-3 d-flex justify-content-center">Sign in page</p>
      </>
  );
};

export default Signin;

Signin.getLayout = function getLayout(page: any) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};
