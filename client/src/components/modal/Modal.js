import { useCallback } from "react";
import Form from "./Form";

const Modal = props => {
  const preventClosing = useCallback(event => {
    event.stopPropagation();
  }, []);

  return (
    <div onClick={props.onCloseModal} className="modal-bg">
      <div onClick={preventClosing} className="modal">
        <h2 className="modal-header heading-secondary">Event Details</h2>
        <Form {...props} />
        <span onClick={props.closeModal}>&times;</span>
      </div>
    </div>
  );
};

export default Modal;
