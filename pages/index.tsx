import Layout from "../components/layout";
import Head from "next/head";
import Table from "../components/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [triggerFetch, setTriggerFetch] = useState(false);

  if (session) {
    try {
      router.push("/signin");
    } catch (err) {}
    return null;
  }

  //Set a fetch interval for new data - used for reloading data in production screen
  useEffect(() => {
    let intervalID = setInterval(() => {
      setTriggerFetch(true);
      setTriggerFetch(false);
    }, 10000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <>
      <Head>
        <title>View projects</title>
      </Head>

      <div className="tableOverflowView fullScreen">
        <Table triggerFetchProp={triggerFetch} mode={"view"} />
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
