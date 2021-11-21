import "../styles/globals.scss";
import "animate.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import configureStore from '../components/store/store';
import {useState} from "react";

function MyApp({ Component, pageProps }: any) {
    const [showModal, setShowModal] = useState(false);

    const handleModal =()=>{

    }
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={configureStore}>
        <LayoutWrapper Component={Component} pageProps={pageProps} />
      </Provider>
    </SessionProvider>
  );
}
export default MyApp;

function LayoutWrapper({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);
  return getLayout(<Component {...pageProps} />);
}
