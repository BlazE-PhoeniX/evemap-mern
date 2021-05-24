import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAll } from "../hooks/use-input";
import { eventsActions } from "./events";
import { showAlert, showLoader, hideLoader } from "./ui";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload.user;
      state.user.id = action.payload.user._id;
    },

    logoutUser(state, action) {
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

export const loginUser = (auth, history) => {
  return async dispatch => {
    try {
      dispatch(showLoader());
      const res = await axios.post("/api/v1/users/login", {
        email: auth.email.value,
        password: auth.password.value,
      });

      dispatch(showAlert("success", res.data.message));
      dispatch(authActions.loginUser({ user: res.data.user }));
      localStorage.setItem("jwt", res.data.token);

      resetAll(auth.email, auth.password);

      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (err) {
      dispatch(showAlert("error", err.response.data.message));
    }
    dispatch(hideLoader());
  };
};

export const signupUser = (creds, history) => {
  return async dispatch => {
    try {
      dispatch(showLoader());
      const res = await axios.post("/api/v1/users/signup", {
        name: creds.name.value,
        email: creds.email.value,
        password: creds.password.value,
        passwordConfirm: creds.confirmPassword.value,
      });

      dispatch(showAlert("success", res.data.message));
      dispatch(authActions.loginUser({ user: res.data.user }));
      localStorage.setItem("jwt", res.data.token);

      resetAll(creds.name, creds.email, creds.password, creds.confirmPassword);

      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (err) {
      dispatch(showAlert("error", err.response.data.message));
    }
    dispatch(hideLoader());
  };
};

export const forgetPassword = (creds, history) => {
  return async dispatch => {
    try {
      dispatch(showLoader());
      const res = await axios.post(`/api/v1/users/forget-password`, {
        email: creds.email.value,
      });

      dispatch(showAlert("success", res.data.message));
      resetAll(creds.email);
    } catch (err) {
      dispatch(showAlert("error", err.response.data.message));
    }
    dispatch(hideLoader());
  };
};

export const resetPassword = (creds, history) => {
  return async dispatch => {
    try {
      dispatch(showLoader());
      const res = await axios.patch(
        `/api/v1/users/reset-password/${creds.token}`,
        {
          password: creds.newPassword.value,
          passwordConfirm: creds.confirmPassword.value,
        }
      );

      dispatch(showAlert("success", res.data.message));
      resetAll(creds.newPassword, creds.confirmPassword);

      setTimeout(() => {
        history.push("/login");
      }, 1000);
    } catch (err) {
      dispatch(showAlert("error", err.response.data.message));
    }
    dispatch(hideLoader());
  };
};

export const checkLogin = () => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    // if (token) {
    try {
      dispatch(showLoader());
      const res = await axios.get("/api/v1/users/check-login", {
        // headers: {
        //   authorization: "Bearer " + token,
        // },
      });
      dispatch(authActions.loginUser({ user: res.data.user }));
    } catch (err) {
      dispatch(showAlert("error", err.response.data.message));
    }
    dispatch(hideLoader());
    // }
  };
};

export const logoutUser = (history, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    // if (token) {
    if (user) {
      try {
        dispatch(showLoader());
        const res = await axios.get("/api/v1/users/logout", {
          // headers: {
          //   authorization: "Bearer " + token,
          // },
        });

        dispatch(showAlert("success", res.data.message));
        localStorage.removeItem("jwt");
        dispatch(authActions.logoutUser());
        dispatch(eventsActions.replaceEvents({ events: [] }));

        setTimeout(() => {
          history.push("/");
        }, 1000);
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      dispatch(hideLoader());
    }
  };
};

export const updateProfile = (creds, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    // if (token) {
    if (user)
      try {
        dispatch(showLoader());
        const res = await axios.patch(
          "/api/v1/users/update-profile",
          {
            name: creds.name.value,
            email: creds.email.value,
          }
          // {
          //   headers: {
          //     authorization: "Bearer " + token,
          //   },
          // }
        );

        dispatch(showAlert("success", res.data.message));
        dispatch(authActions.loginUser({ user: res.data.data.user }));
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
    // }
    dispatch(hideLoader());
  };
};

export const updatePassword = (creds, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    // if (token) {
    if (user) {
      try {
        dispatch(showLoader());
        const res = await axios.patch(
          "/api/v1/users/update-password",
          {
            oldPassword: creds.currentPassword.value,
            password: creds.newPassword.value,
            passwordConfirm: creds.confirmPassword.value,
          }
          // {
          //   headers: {
          //     authorization: "Bearer " + token,
          //   },
          // }
        );

        dispatch(showAlert("success", res.data.message));
        localStorage.setItem("jwt", res.data.token);
        resetAll(
          creds.currentPassword,
          creds.newPassword,
          creds.confirmPassword
        );
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      // }
      dispatch(hideLoader());
    }
  };
};
