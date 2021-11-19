import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import Layout from "../components/layout";
import Image from "next/image";

const Signin = ({ csrfToken }: any) => {
  const { data: session } = useSession();
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
            <div className="bg-success rounded-bottom rounded-pill">
              <p className="display-4 text-white text-center">
                Signed in as {loggedUser}
              </p>
              <Image
                src="/undraw_completed_re_cisp.svg"
                height={250}
                width={800}
                alt="Success Picture"
                priority
                className="animate__animated animate__bounceIn p-3"
              ></Image>
            </div>
            <p className="display-4 text-white">
              You can navigate to edit projects
            </p>
          </div>
        </div>
      </>
    );
  } else
    return (
      <>
        <div className="container h-100">
          <div className="h-100 d-flex flex-column justify-content-evenly">
            <div className="d-flex justify-content-between ">
              <Image
                src="/undraw_authentication_fsn5.svg"
                width={620}
                height={500}
                priority
                alt="sign in image"
              ></Image>
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
