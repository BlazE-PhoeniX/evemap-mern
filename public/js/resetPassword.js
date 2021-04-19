import { showAlert } from "./alert";

export const resetPassword = async function (token, password, passwordConfirm) {
  const res = await (
    await fetch(`/api/v1/users/reset-password/${token}`, {
      method: "PATCH",
      body: JSON.stringify({ password, passwordConfirm }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if (res.status === "success") {
    showAlert("success", res.message);
    location.assign("/");
  } else {
    showAlert("error", res.message);
  }
};

export const forgotPassword = async function (email) {
  const res = await (
    await fetch(`/api/v1/users/forget-password/`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if (res.status === "success") {
    showAlert("success", res.message);
  } else {
    showAlert("error", res.message);
  }
};
