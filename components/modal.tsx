import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface ModalProps {
  title: string;
  description: string;
  pictureUrl: string;
  className: string;
}

const Modal = (props: ModalProps) => {
  const modalElement = useRef(null);

  return (
    <>
      <div
        className={props.className}
        ref={modalElement}
      >
        <h1 className="text-light display-5">{props.title}</h1>
        <Image
          src={props.pictureUrl}
          height={200}
          width={200}
          alt="modal image"
          priority
        ></Image>
        <p className="text-light display-6">{props.description}</p>
      </div>
    </>
  );
};
export default Modal;
