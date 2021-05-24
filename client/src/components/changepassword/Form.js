import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import { updatePassword } from "../../store/auth";
import Input from "../ui/Input";

const Form = props => {
  const user = useSelector(state => state.auth.user);
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const currentPassword = useInput({
    validate: value => value.trim().length >= 8,
  });
  const newPassword = useInput({ validate: value => value.trim().length >= 8 });
  const confirmPassword = useInput({
    validate: ((password, value) =>
      value !== "" && value === password.value).bind(null, newPassword),
  });

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(currentPassword, newPassword, confirmPassword);

    if (!validateAll(currentPassword, newPassword, confirmPassword)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    dispatchRedux(
      updatePassword({ currentPassword, newPassword, confirmPassword }, user)
    );
  };

  return (
    <form
      onSubmit={formSubmitHandler}
      noValidate
      className="form form-user-password">
      {formError && <p className="form-error">{formError.message}</p>}
      <Input
        label="Current password"
        input={{
          className: "form__input",
          id: "password-current",
          type: "password",
          placeholder: "••••••••",
          value: currentPassword.value,
          onChange: currentPassword.onChange,
          onBlur: currentPassword.onBlur,
          autoComplete: "off",
        }}
        invalid={currentPassword.inputIsInvalid}
        errorMsg="Password must be greater than 7 characters"
      />
      <Input
        label="Password"
        input={{
          className: "form__input",
          id: "password",
          type: "password",
          placeholder: "••••••••",
          value: newPassword.value,
          onChange: newPassword.onChange,
          onBlur: newPassword.onBlur,
          autoComplete: "off",
        }}
        invalid={newPassword.inputIsInvalid}
        errorMsg="Password must be greater than 7 characters"
      />
      <Input
        className="ma-bt-lg"
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
        errorMsg="Confirm password doesn't match new password"
      />
      <div className="form__group right">
        <button className="btn btn--green btn--small">Change password</button>
      </div>
    </form>
  );
};

export default Form;
