import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../../store/auth";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import Input from "../ui/Input";

const Form = props => {
  const history = useHistory();
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const email = useInput({
    validate: value => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value),
  });

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(email);

    if (!validateAll(email)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    dispatchRedux(forgetPassword({ email }, history));
  };

  return (
    <form
      onSubmit={formSubmitHandler}
      noValidate
      className="form form--password-forget">
      {formError && <p className="form-error">{formError.message}</p>}
      <Input
        label="Email address"
        input={{
          className: "form__input",
          id: "email",
          type: "email",
          placeholder: "you@example.com",
          value: email.value,
          onChange: email.onChange,
          onBlur: email.onBlur,
        }}
        invalid={email.inputIsInvalid}
        errorMsg="Provide valid email address"
      />
      <div className="form__group">
        <button className="btn btn--green">Send Link</button>
      </div>
    </form>
  );
};

export default Form;
