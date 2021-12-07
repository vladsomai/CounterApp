import { useSession, getCsrfToken } from "next-auth/react";
import Layout from "../components/layout";
import Image from "next/image";
import Modal, { ModalProps } from "../components/modal";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import Head from "next/head";
import { useState } from "react";

const Signin = ({ csrfToken }: any) => {
  const { data: session, status } = useSession();
  const { error } = useRouter().query;
  const modalElement = useRef(null);
  const router = useRouter();
  const parentModalElement = useRef(null);
  const [modalProps, setModalProps] = useState<ModalProps>({
    title: "",
    description: "",
    pictureUrl: "/undraw_cancel_u-1-it.svg",
    className: "",
  });

  const [signinError, setSigninError] = useState(false);

  const closeModal = () => {
    if (modalElement.current && parentModalElement.current) {
      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.remove("animate__bounceIn");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.add("animate__bounceOut");
      setTimeout(() => {
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("d-none");
        // @ts-ignore: Object is possibly 'null'.
        parentModalElement.current.classList.add("d-none");
      }, 650);
    }
    router.push("/signin");
  };

  const openModal = (parameters: ModalProps) => {
    if (modalElement.current && parentModalElement.current) {
      if (parameters.title === "Error!") {
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.remove(
          "bg-danger",
          "bg-success",
          "bg-warning"
        );
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("bg-danger");
      } else if (parameters.title === "Success!") {
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.remove(
          "bg-danger",
          "bg-success",
          "bg-warning"
        );
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("bg-success");
      }

      // @ts-ignore: Object is possibly 'null'.
      parentModalElement.current.classList.remove("d-none");
      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.remove("animate__bounceOut", "d-none");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.add("animate__bounceIn");
    }
    setModalProps(parameters);
  };

  useEffect(() => {
    if (error) {
      setSigninError(true);
      openModal({
        title: "Error!",
        description: "Invalid account!",
        pictureUrl: "/undraw_cancel_u-1-it.svg",
        className: "text-center",
      });
    } else {
      setSigninError(true);
    }
  }, [error]);

  if (session) {
    try {
      router.push("/editprojects");
    } catch (err) {}
    return null;
  } else
    return (
      <>
        <Head>
          <title>Signin</title>
        </Head>
        <div className="fullScreen d-flex flex-column justify-content-center container">
          <div className="d-flex flex-column justify-content-evenly">
            <div className="d-flex flex-column flex-md-row justify-content-between align-content-center position-relative">
              <Image
                src="/undraw_authentication_fsn5.svg"
                width={620}
                height={500}
                priority
                alt="sign in image"
                className=""
              ></Image>

              <div className="d-flex align-items-center justify-content-center">
                <form
                  action={"/api/auth/callback/credentials"}
                  className="d-flex flex-column align-items-center mt-3"
                  method="post"
                >
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <input
                    name="email"
                    type="email"
                    className="form-control fs-1 mb-4"
                    placeholder="Email"
                    aria-label="Email"
                    required
                  ></input>
                  <input
                    name="password"
                    type="password"
                    className="form-control fs-1 mb-4"
                    placeholder="Password"
                    aria-label="Password"
                    required
                  ></input>
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold fs-2"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
          {signinError && (
            <div className="d-none" ref={parentModalElement}>
              <div className="position-fixed start-50 top-50 translate-middle w-100 h-100 pt-5 blurBg">
                <div
                  className="animate__animated d-none rounded-pill mx-auto p-5 d-flex flex-column justify-content-center w-50 paddingModal"
                  ref={modalElement}
                >
                  <Modal
                    title={modalProps.title}
                    description={modalProps.description}
                    pictureUrl={modalProps.pictureUrl}
                    className={modalProps.className}
                  />
                  <button
                    className="btn btn-primary fs-3 m-auto fw-bold"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
};

export default Signin;

Signin.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
