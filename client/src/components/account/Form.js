import { useEffect, useState } from "react";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import Input from "../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/auth";

const Form = props => {
  const user = useSelector(state => state.auth.user);
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const name = useInput({ validate: value => value.trim() !== "" });
  const email = useInput({
    validate: value => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value),
  });

  useEffect(() => {
    if (user) {
      name.setValue(user.name);
      email.setValue(user.email);
    }

    // eslint-disable-next-line
  }, []);

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(name, email);

    if (!validateAll(name, email)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    dispatchRedux(updateProfile({ name, email }, user));
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
      <div className="form__group right">
        <button className="btn btn--small btn--green">Save Details</button>
      </div>
    </form>
  );
};

export default Form;
