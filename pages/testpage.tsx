import Layout from "../components/layout";
import { useEffect, useState, useRef } from "react";
import Modal from "../components/modal";
import React from "react";

const TestPage = () => {
  const modalElement = useRef(null);

  const openModal = () => {

    if (modalElement.current) {
      // @ts-ignore: Object is possibly 'null'.
      console.log(modalElement.current.classList);
      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.remove("animate__bounceOut", "d-none");

      // @ts-ignore: Object is possibly 'null'.
      modalElement.current.classList.add("animate__bounceIn");
    }

  };
  const closeModal = () => {
    // @ts-ignore: Object is possibly 'null'.
    console.log(modalElement.current.classList);
    // @ts-ignore: Object is possibly 'null'.
    console.log(modalElement.current.classList.remove("animate__bounceIn"));

    // @ts-ignore: Object is possibly 'null'.
    console.log(modalElement.current.classList.add("animate__bounceOut"));
    // if (modalElement.current) {
    //   setTimeout(() => {
    //     // @ts-ignore: Object is possibly 'null'.
    //     console.log(modalElement.current.classList.add("d-none"));
    //   }, 500);
    // }
  };

    return (
      <>
  <div className="position-relative">
        <div className="position-absolute top-50 start-50 translate-middle h-100 w-75 pt-5">
          <div
            ref={modalElement}
            className="animate__animated d-none rounded-pill m-auto p-5 bg-danger d-flex flex-column justify-content-center w-75"
          >
            {/* <Modal
              title="Success!"
              description=""
              pictureUrl="/undraw_confirmation_re_b6q5.svg"
              className="text-center"
            /> */}

            <Modal
              title="Error!"
              description="An adapter code with the same fixture type already exists!"
              pictureUrl="/undraw_cancel_u-1-it.svg"
              className="text-center"
            />
            <button
              className="btn btn-primary btn-lg fs-4 w-25 m-auto"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>

        <div className="d-flex justify-content-around align-items-center h-50">

            <p className="display-1 text-light text-center">my simple page</p>
          <button
            className="btn btn-secondary btn-lg fs-1"
            onClick={openModal}
          >
            Open
          </button>
        </div>
      </>
    );
};

export default TestPage;

TestPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
