import Head from "next/head";
import Layout from "../components/layout";
import Table from "../components/grid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import Modal, { ModalProps } from "../components/modal";

const TestPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [triggerFetch, setTriggerFetch] = useState(false);

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
          "bg-warning",
          "bg-info"
        );
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("bg-danger");
      } else if (parameters.title === "Success!") {
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.remove(
          "bg-danger",
          "bg-success",
          "bg-warning",
          "bg-info"
        );
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("bg-success");
      } else if (parameters.title === "Project description") {
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.remove(
          "bg-danger",
          "bg-success",
          "bg-warning",
          "bg-info"
        );
        // @ts-ignore: Object is possibly 'null'.
        modalElement.current.classList.add("bg-info");
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

  return (
    <>
      <Head>
        <title>testpage</title>
      </Head>

      <div className="">
        <div className="paddingTopBottom">
          <Table triggerFetchProp={triggerFetch} openModalAction={openModal} />
        </div>

        <div className="d-none" ref={parentModalElement}>
          <div className="position-fixed start-50 top-50 translate-middle w-100 h-100 blurBg d-flex justify-content-center">
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
              <button
                ref={closeModalBtn}
                className="btn btn-primary fs-3 m-auto fw-bold scaleEffect"
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
};

export default TestPage;

TestPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
