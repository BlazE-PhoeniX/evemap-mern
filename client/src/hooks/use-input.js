import { useReducer } from "react";

const inputReducer = (state, action) => {
  if (action.type === "VALUE_CHANGE") {
    return {
      value: action.value,
      isTouched: state.isTouched,
    };
  }

  if (action.type === "INPUT_TOUCH") {
    return {
      value: state.value,
      isTouched: action.isTouched,
    };
  }

  if (action.type === "INPUT_RESET") {
    return {
      value: "",
      isTouched: false,
    };
  }

  return {
    value: "",
    isTouched: false,
  };
};

const useInput = validator => {
  const [input, dispatchInput] = useReducer(inputReducer, {
    value: "",
    isTouched: false,
  });

  const valueIsValid = validator.validate(input.value);
  const inputIsInvalid = input.isTouched && !valueIsValid;

  const changeHandler = event => {
    dispatchInput({ type: "VALUE_CHANGE", value: event.target.value });
  };

  const blurHandler = () => {
    dispatchInput({ type: "INPUT_TOUCH", isTouched: true });
  };

  const reset = () => {
    dispatchInput({ type: "INPUT_RESET" });
  };

  const touch = isTouched => {
    dispatchInput({ type: "INPUT_TOUCH", isTouched });
  };

  const setValue = value => {
    dispatchInput({ type: "VALUE_CHANGE", value });
  };

  return {
    value: input.value,
    isValid: valueIsValid,
    inputIsInvalid,
    onChange: changeHandler,
    onBlur: blurHandler,
    setValue,
    touch,
    reset,
  };
};

export default useInput;

export const touchAll = (...inputs) => {
  inputs.forEach(input => input.touch(true));
};

export const resetAll = (...inputs) => {
  inputs.forEach(input => {
    input.reset();
  });
};

export const validateAll = (...inputs) => {
  let valid = true;

  inputs.forEach(input => {
    if (!input.isValid) {
      valid = false;
    }
  });

  return valid;
};
