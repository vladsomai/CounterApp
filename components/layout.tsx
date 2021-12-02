import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";
import styles from "./styles/layout.module.scss";

export default function Layout({ session, children }: any) {
  return (
    <>
      <Head>
        <title>Line Counter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          content="Counter app used for tracking fixture contacts"
          name="Counter app"
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <div className="position-fixed w-100">
        <div className="bg-primary">
          <Navbar />
        </div>
      </div>

      <main className={styles.height80}>{children}</main>

      <div className="position-fixed bottom-0 w-100 bg-dark">
        <Footer />
      </div>
    </>
  );
}
