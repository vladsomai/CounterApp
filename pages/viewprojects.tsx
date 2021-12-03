import Layout from "../components/layout";
import Table from "../components/table";

const ViewProjects = () => {
  return (
    <>
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
