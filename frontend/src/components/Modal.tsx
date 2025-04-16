import { PropsWithChildren } from "react";
import { Modal } from "@/types";

const Modal = ({ children, close }: PropsWithChildren<Modal>) => {
  return (
    <div className="absolute grid place-content-center inset-0 bg-[rgba(0,0,0,0.2)] text-black">
      <div className="bg-white rounded p-5 w-[360px] h-fit relative">
        <div onClick={close} className="absolute top-5 right-5 cursor-pointer">
          X
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
