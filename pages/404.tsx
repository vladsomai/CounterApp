import Layout from "../components/layout";
import Image from "next/image";
import Dashboard from "../components/dashboard";
import Head from "next/head";

const Error = () => {
  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <div className="d-flex justify-content-center align-content-center text-light pt-5 fullScreen">
        <div className="">
          <Image
            src="/undraw_questions_re_1fy7.svg"
            width={620}
            height={500}
            priority
            alt="sign in image"
            className=""
          ></Image>
          <h1 className="display-1 text-danger">Page not found</h1>
        </div>
      </div>
    </>
  );
};

export default Error;

Error.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
