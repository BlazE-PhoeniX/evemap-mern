import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { signupUser } from "../../store/auth";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import Input from "../ui/Input";

const Form = props => {
  const history = useHistory();
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const name = useInput({ validate: value => value.trim() !== "" });
  const email = useInput({
    validate: value => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value),
  });
  const password = useInput({ validate: value => value.trim().length >= 8 });
  const confirmPassword = useInput({
    validate: ((password, value) =>
      value !== "" && value === password.value).bind(null, password),
  });

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(name, email, password, confirmPassword);

    if (!validateAll(name, email, password, confirmPassword)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    const creds = {
      name,
      email,
      password,
      confirmPassword,
    };

    dispatchRedux(signupUser(creds, history));
  };

  return (
    <form onSubmit={formSubmitHandler} noValidate className="form form--signup">
      {formError && <p className="form-error">{formError.message}</p>}
      <Input
        label="Name"
        input={{
          className: "form__input",
          id: "name",
          type: "text",
          placeholder: "Your Name",
          value: name.value,
          onChange: name.onChange,
          onBlur: name.onBlur,
        }}
        invalid={name.inputIsInvalid}
        errorMsg="Name must not be an empty string"
      />
      <Input
        className="ma-bt-md"
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
      <Input
        className="ma-bt-md"
        label="Password"
        input={{
          className: "form__input",
          id: "password",
          type: "password",
          placeholder: "••••••••",
          value: password.value,
          onChange: password.onChange,
          onBlur: password.onBlur,
          autoComplete: "off",
        }}
        invalid={password.inputIsInvalid}
        errorMsg="Password must be greater than 7 characters"
      />
      <Input
        className="ma-bt-md"
        label="Confirm Password"
        input={{
          className: "form__input",
          id: "password-confirm",
          type: "password",
          placeholder: "••••••••",
          value: confirmPassword.value,
          onChange: confirmPassword.onChange,
          onBlur: confirmPassword.onBlur,
          autoComplete: "off",
        }}
        invalid={confirmPassword.inputIsInvalid}
        errorMsg="Confirm password doesn't match password"
      />
      <div className="form__group">
        <button className="btn btn--green">Sign up</button>
      </div>
    </form>
  );
};

export default Form;
