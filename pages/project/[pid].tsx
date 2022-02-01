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

  if (fetchedProject) {
    return (
      <>
        <Head>
          <title>Project&nbsp;{pid}</title>
        </Head>

        <div className="paddingTopBottom text-white w-100 d-flex justify-content-center">
          <p>Entry &nbsp; {fetchedProject.entry_id}</p>
        </div>
      </>
    );
  } else {
    <>
      <h1>LAL</h1>
    </>;
  }
};

export default ProjectPage;

ProjectPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
