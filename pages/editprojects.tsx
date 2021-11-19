import Layout from "../components/layout";
import Table from "../components/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddNewProject from "../components/addNewProject";

const EditProjects = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === "authenticated") {
    return (
      <>
        <div className="tableOverflowEdit">
          <Table />
        </div>
        <div className="pt-3" id="addNewProjectDiv">
          <AddNewProject/>
        </div>
      </>
    );
  } else if (status === "loading")
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <div className="d-flex justify-content-center">
          <div
            className="spinner-grow text-primary"
            style={{ width: "10rem", height: "10rem" }}
            role="status"
          >
            <span className=""></span>
          </div>
        </div>
        <div className="d-flex justify-content-center p-5">
          <p className="text-white display-5">Loading data...</p>
        </div>
      </div>
    );
  else {
    try {
      router.push("/signin");
    } catch (err) {}
    return null;
  }
};

export default EditProjects;

EditProjects.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
