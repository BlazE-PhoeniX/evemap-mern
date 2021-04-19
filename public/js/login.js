import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios.post("/api/v1/users/login", {
      email,
      password,
    });
    if (res.data.status === "success") {
      showAlert("success", res.data.message);
      setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  const res = await (await fetch("/api/v1/users/logout")).json();

  if (res.status === "success") {
    showAlert("success", res.message);
    setTimeout(() => {
      location.assign("/");
    }, 1000);
  } else {
    showAlert("error", res.message);
  }
};
