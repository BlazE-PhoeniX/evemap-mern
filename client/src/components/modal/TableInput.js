import { useEffect, useRef } from "react";

const TableInput = props => {
  const inputRef = useRef();

  useEffect(() => {
    if (props.readOnly) {
      inputRef.current.setAttribute("readonly", "true");
    } else {
      inputRef.current.removeAttribute("readonly");
    }
  }, [props.readOnly, inputRef]);

  return (
    <tr>
      <td>{props.label}</td>
      <td>:</td>
      <td>
        <input ref={inputRef} {...props.input} />
        {props.invalid && <p className="input-error">{props.errorMsg}</p>}
      </td>
    </tr>
  );
};

export default TableInput;
