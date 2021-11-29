import Layout from "../components/layout";
import Table from "../components/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddNewProject from "../components/addNewProject";
import { useRef, useState, useEffect } from "react";
import Modal, { ModalProps } from "../components/modal";

const EditProjects = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [triggerFetch, setTriggerFetch] = useState(false);

  const modalElement = useRef(null);
  const [modalProps, setModalProps] = useState<ModalProps>({
    title: "",
    description: "",
    pictureUrl: "/undraw_cancel_u-1-it.svg",
    className: "",
  });

  const openModal = (parameters: ModalProps) => {
    if (modalElement.current) {
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
      modalElement.current.classList.remove("animate__bounceOut", "d-none");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.add("animate__bounceIn");
    }
    setTriggerFetch(true);
    setModalProps(parameters);
  };

  const closeModal = () => {
    setTriggerFetch(false);

    if (modalElement.current) {
      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.remove("animate__bounceIn");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.add("animate__bounceOut");
    }
  };

  if (status === "authenticated") {
    return (
      <>
        <div className="position-relative">
          <div className="position-absolute top-50 start-50 translate-middle h-100 w-75 pt-5">
            <div
              ref={modalElement}
              className="animate__animated d-none rounded-pill m-auto p-5 d-flex flex-column justify-content-center w-75"
            >
              <Modal
                title={modalProps.title}
                description={modalProps.description}
                pictureUrl={modalProps.pictureUrl}
                className={modalProps.className}
              />
              <button
                className="btn btn-primary btn-lg fs-4 w-25 m-auto fw-bold"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="tableOverflowEdit">
          <Table triggerFetchProp={triggerFetch} openModalAction={openModal} />
        </div>
        <div className="pt-3" id="addNewProjectDiv">
          <AddNewProject openModalAction={openModal} />
        </div>
      </>
    );
  } else if (status === "loading")
    return (
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
    );
  else {
    try {
      router.push("/signin");
    } catch (err) {}
    return null;
  }
};

export default EditProjects;

EditProjects.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
