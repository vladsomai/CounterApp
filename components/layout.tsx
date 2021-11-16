import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";
import styles from "./styles/layout.module.scss";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <title>Line Counter</title>
        <meta
          name="Counter app used for tracking fixture contacts"
          content="Counter app"
        />
      </Head>
      <div className={styles.height10}>
        <div className="bg-primary">
          <Navbar />
        </div>
      </div>
      <div className="container">
        <main className={styles.height80}>{children}</main>
      </div>

      <div className={styles.height10}>
        <Footer />
      </div>
    </>
  );
}
