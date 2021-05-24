import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useInput, { touchAll, validateAll } from "../../hooks/use-input";
import { resetPassword } from "../../store/auth";
import Input from "../ui/Input";
import { useHistory, useRouteMatch } from "react-router";

const Form = props => {
  const tokenRef = useRef();
  const history = useHistory();
  const match = useRouteMatch();
  const [formError, setFormError] = useState(null);
  const dispatchRedux = useDispatch();

  const newPassword = useInput({ validate: value => value.trim().length >= 8 });
  const confirmPassword = useInput({
    validate: ((password, value) =>
      value !== "" && value === password.value).bind(null, newPassword),
  });

  const formSubmitHandler = async e => {
    e.preventDefault();
    setFormError(null);
    touchAll(newPassword, confirmPassword);

    if (!validateAll(newPassword, confirmPassword)) {
      setFormError({ message: "Provide valid details to continue." });
      return;
    }

    dispatchRedux(
      resetPassword(
        {
          token: tokenRef.current.value,
          newPassword,
          confirmPassword,
        },
        history
      )
    );
  };

  return (
    <form
      onSubmit={formSubmitHandler}
      noValidate
      className="form form--pasword-reset">
      {formError && <p className="form-error">{formError.message}</p>}
      <input
        ref={tokenRef}
        id="token"
        type="hidden"
        value={match.params.token || ""}
      />
      <Input
        label="New Password"
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
        <button className="btn btn--green btn--small">Reset password</button>
      </div>
    </form>
  );
};

export default Form;
