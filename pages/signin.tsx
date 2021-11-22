import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import Layout from "../components/layout";
import Image from "next/image";
import Modal from "../components/modal";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";

const Signin = ({ csrfToken }: any) => {
  const { data: session, status } = useSession();
  const { error } = useRouter().query;
  const modalElement = useRef(null);
  const router = useRouter();

  const closeModal = () => {
    if (modalElement.current) {
      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList?.remove("animate__bounceIn");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList?.add("animate__bounceOut");
    }
    router.push("/signin");

  };

  const handleSubmit = () => {
    fetch("/api/checkLogin", { method: "POST" })
      .then((result) =>
        result.json().then((resultJson) => {
          alert(resultJson.method);
        })
      )
      .catch((err) => {
        alert(err.method);
      });
  };

  const loggedUser = session?.user?.name || session?.user?.email;
  if (session) {
    return (
      <>
        <div className="container h-100">
          <div className="d-flex flex-column align-items-center justify-content-around h-100">
            <Modal
              title="Success!"
              description={`Signed in as ${loggedUser}`}
              pictureUrl="/undraw_confirmation_re_b6q5.svg"
              className="text-center bg-success rounded-pill w-75"
            />
          </div>
        </div>
      </>
    );
  } else
    return (
      <>
        <div className="container h-100">
          <div className="h-100 d-flex flex-column justify-content-evenly">
            <div className="d-flex justify-content-between position-relative">
              <Image
                src="/undraw_authentication_fsn5.svg"
                width={620}
                height={500}
                priority
                alt="sign in image"
                className=""
              ></Image>
              {error && (
                <div className="position-absolute top-50 start-50 translate-middle h-100 w-75 pt-5">
                  <div
                    ref={modalElement}
                    className="animate__animated animate__bounceIn bg-danger bringFront rounded-pill m-auto p-5 d-flex flex-column justify-content-center w-75"
                  >
                    <Modal
                      title="Error!"
                      description="Invalid account!"
                      pictureUrl="/undraw_cancel_u-1-it.svg"
                      className="text-center"
                    />
                    <button
                      className="btn btn-primary btn-lg fs-4 w-25 m-auto fw-bold"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center">
                <form
                  action="/api/auth/callback/credentials"
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

            <div className="w-100 d-flex justify-content-center">
              <button
                className="btn btn-dark btn-large text-center fs-4 d-flex align-items-center w-25 justify-content-around"
                onClick={() => signIn("github")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Sign in with Github!
              </button>
            </div>
          </div>
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
