import Layout from "../components/layout";

const Signin = () => {
  return (
    <>
      <p className="text-light display-3 d-flex justify-content-center">
        Sign in page
      </p>
    </>
  );
};

export default Signin;

Signin.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
