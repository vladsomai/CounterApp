import Layout from "../components/layout";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddNewProject from "../components/addNewProject";
import { useState, useRef } from "react";
import Modal, { ModalProps } from "../components/modal";
import Image from "next/image";

const CreateProject = () => {
  const { status } = useSession();
  const router = useRouter();

  const modalElement = useRef(null);
  const closeModalBtn = useRef(null);
  const parentModalElement = useRef(null);

  const [modalProps, setModalProps] = useState<ModalProps>({
    title: "",
    description: "",
    pictureUrl: "/undraw_cancel_u-1-it.svg",
    className: "",
  });

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
    // @ts-ignore: Object is possibly 'null'.
    closeModalBtn.current.focus();
  };

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
  };
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Create project</title>
        </Head>
        <div className="d-flex flex-column justify-content-center align-items-center position-relative top-0 start-0 w-100 screen-100 bg-light paddingTopBottom m-auto">
          <Image
            src="/create_project.svg"
            width={window.innerWidth / 2}
            height={window.innerHeight / 2}
            priority
            alt="createProject"
            className=""
          ></Image>
          <div className="w-100">
            <AddNewProject openModalAction={openModal} />
          </div>
        </div>
        <div className="d-none" ref={parentModalElement}>
          <div className="position-fixed start-50 top-50 translate-middle w-100 h-100 blurBg d-flex justify-content-center zIndex-2000">
            <div
              className="animate__animated d-none rounded-pill p-5 d-flex flex-column justify-content-center w-50 my-auto paddingModal"
              ref={modalElement}
            >
              <Modal
                title={modalProps.title}
                description={modalProps.description}
                pictureUrl={modalProps.pictureUrl}
                className={modalProps.className}
              />

              <div className="d-flex flex-column justify-content-around">
                <button
                  ref={closeModalBtn}
                  className="btn btn-danger fs-3 m-auto fw-bold scaleEffect"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "loading")
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <div className="d-flex justify-content-center">
            <div
              className="spinner-grow text-primary"
              style={{ width: "10rem", height: "10rem" }}
              role="status"
            >
              <span className=""></span>
            </div>
          </div>
          <div className="d-flex justify-content-center p-5">
            <p className="text-white display-5">Loading data...</p>
          </div>
        </div>
      </>
    );
  else {
    try {
      router.push("/signin");
    } catch (err) {}
    return null;
  }
};

export default CreateProject;

CreateProject.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
