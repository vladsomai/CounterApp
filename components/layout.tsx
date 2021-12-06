import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";
import styles from "./styles/layout.module.scss";

export default function Layout({ session, children }: any) {
  return (
    <>
      <Head>
        <title>Line Counter</title>
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
