import Layout from "../components/layout";
import Head from "next/head";
import Table from "../components/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (session) {
    try {
      router.push("/signin");
    } catch (err) {}
    return null;
  }

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

export default Home;

Home.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
