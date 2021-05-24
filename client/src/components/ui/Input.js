const Input = props => {
  return (
    <div className={"form__group " + props.className}>
      <label className="form__label" htmlFor={props.input.id}>
        {props.label}
      </label>
      <input {...props.input} />
      {props.invalid && <p className="input-error">{props.errorMsg}</p>}
    </div>
  );
};

export default Input;
