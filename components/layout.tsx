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
      <div className={styles.height10}>
        <div className="bg-primary">
          <Navbar />
        </div>
      </div>

      <main className={styles.height80}>{children}</main>

      <div className={styles.height10}>
        <Footer />
      </div>
    </>
  );
}
