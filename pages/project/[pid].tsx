import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Project } from "../api/counterTypes";
import Layout from "../../components/layout";

const ProjectPage = (props: Project) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session) {
    try {
      router.push("/");
    } catch (err) {}
    return null;
  }
  return (
    <>
      <Head>
        <title>Project&nbsp;{props.project_name}</title>
      </Head>

      <div className="paddingTopBottom">
        <h1 className="text-white w-100 d-flex justify-content-center">
          Project &nbsp; {props.adapter_code} &nbsp; {props.fixture_type}
        </h1>
      </div>
    </>
  );
};

export default ProjectPage;

ProjectPage.getLayout = function getLayout(page: any) {
    return <Layout>{page}</Layout>;
  };