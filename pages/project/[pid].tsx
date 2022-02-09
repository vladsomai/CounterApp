import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Project } from "../api/counterTypes";
import Layout from "../../components/layout";
import { makeDatabaseAction } from "../../components/table";
import { useEffect, useState } from "react";

const ProjectPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pid } = router.query;
  const entryID: number = parseInt(pid as string);
  const [fetchedProject, setFetchedProject] = useState<Project>();
  const [API_Responded, setAPI_Responded] = useState<boolean>(false);

  if (!session) {
    try {
      router.push("/");
    } catch (err) {}
    return null;
  }

  const fetchProject = async () => {
    await makeDatabaseAction(
      "getProjectByID",
      entryID,
      "",
      0,
      "",
      "",
      0,
      0,
      ""
    ).then((item: any) => {
      setFetchedProject(JSON.parse(item).message[0]);
      setAPI_Responded(true);
    });
  };
  useEffect(() => {
    fetchProject();
  }, []);

  if (API_Responded) {
    return (
      <>
        <Head>
          <title>Project&nbsp;{pid}</title>
        </Head>

        <div className="paddingTopBottom text-white w-100 d-flex justify-content-center">
          <div className="d-flex flex-column">
            <p>Entry &nbsp; {fetchedProject?.entry_id}</p>
            <p>Entry &nbsp; {fetchedProject?.project_name}</p>
            <p>Entry &nbsp; {fetchedProject?.adapter_code}</p>
            <p>Entry &nbsp; {fetchedProject?.fixture_type}</p>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>

        <div className="d-flex flex-column align-items-center justify-content-center screen-100 ">
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
            <p className="text-white text-center display-5">Loading data...</p>
          </div>
        </div>
      </>
    );
  }
};

export default ProjectPage;

ProjectPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
