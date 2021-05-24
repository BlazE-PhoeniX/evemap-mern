import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import Input from "../ui/Input";

const Form = props => {
  const history = useHistory();
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const auth = {
    email: useInput({
      validate: value => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value),
    }),
    password: useInput({ validate: value => value.trim().length >= 8 }),
  };

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(auth.email, auth.password);

    if (!validateAll(auth.email, auth.password)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    dispatchRedux(loginUser(auth, history));
  };

  return (
    <form onSubmit={formSubmitHandler} noValidate className="form form--login">
      {formError && <p className="form-error">{formError.message}</p>}
      <Input
        label="Email address"
        input={{
          className: "form__input",
          id: "email",
          type: "email",
          placeholder: "you@example.com",
          value: auth.email.value,
          onChange: auth.email.onChange,
          onBlur: auth.email.onBlur,
        }}
        invalid={auth.email.inputIsInvalid}
        errorMsg="Provide valid email address"
      />
      <Input
        className="ma-bt-md"
        label="Password"
        input={{
          className: "form__input",
          id: "password",
          type: "password",
          placeholder: "••••••••",
          value: auth.password.value,
          onChange: auth.password.onChange,
          onBlur: auth.password.onBlur,
          autoComplete: "off",
        }}
        invalid={auth.password.inputIsInvalid}
        errorMsg="Password must be greater than 7 characters"
      />
      <div className="form__group">
        <button className="btn btn--green">Login</button>
      </div>
    </form>
  );
};

export default Form;
