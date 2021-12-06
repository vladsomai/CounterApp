import Layout from "../components/layout";
import Table from "../components/table";
import Head from "next/head";

const ViewProjects = () => {
  return (
    <>
      <Head>
        <title>View projects</title>
      </Head>
      <div className="tableOverflowView fullScreen">
        <Table mode={"view"} />
      </div>
    </>
  );
};

export default ViewProjects;

ViewProjects.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
