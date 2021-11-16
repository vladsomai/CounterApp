import Layout from "../components/layout";
import Table from "../components/table";

const ViewProjects = () => {
  return (
    <>
      <p className="text-light display-3 d-flex justify-content-center">
        View
      </p>
      <Table />
    </>
  );
};

export default ViewProjects;

ViewProjects.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
