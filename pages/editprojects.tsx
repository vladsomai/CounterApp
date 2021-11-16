import Layout from "../components/layout";

const EditProjects = () => {
  return (
    <>
      <p className="text-light display-3 d-flex justify-content-center">
        Edit
      </p>
    </>
  );
};

export default EditProjects;

EditProjects.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
