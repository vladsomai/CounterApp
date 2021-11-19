import "../styles/globals.scss";
import "animate.css";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "../components/contexts/index";

function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <UserProvider>
        <LayoutWrapper Component={Component} pageProps={pageProps} />
      </UserProvider>
    </SessionProvider>
  );
}
export default MyApp;

function LayoutWrapper({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return getLayout(<Component {...pageProps} />);
}
