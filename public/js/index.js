import "@babel/polyfill";

import { displayMap, addToMap, moveToView } from "./map";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSettings";
import { showLoader, hideLoader } from "./loader";
import { forgotPassword, resetPassword } from "./resetPassword";
import { addToEventsBox, getEventsWithDistance } from "./event";
import { openModal } from "./model";
import { setTimer } from "./timer";

// dom elements
const map = document.getElementById("map");

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const dataForm = document.querySelector(".form-user-data");
const passwordForm = document.querySelector(".form-user-password");
const passwordResetForm = document.querySelector(".form--password-reset");
const passwordForgotForm = document.querySelector(".form--password-forgot");
const logoutBtn = document.querySelector(".side-nav--logout");

const eventsNameList = document.querySelector("#events-name");

const eventsBox = document.querySelector(".events");

const searchInput = document.querySelector(".search-bar");
const searchForm = document.querySelector(".search-div");

const sortInput = document.querySelector(".select--sort");
const filterInput = document.querySelector(".select--filter");

const timeEl = document.querySelector(".nav__el--time");

const alertMessage = document.querySelector("body").dataset.alertMessage;
const alertType = document.querySelector("body").dataset.alertType;
if (alertMessage !== "" && alertType !== "") showAlert(alertType, alertMessage);

if (timeEl) setTimer(timeEl);

if (loginForm)
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    showLoader();
    await login(email, password);
    hideLoader();
  });

if (signupForm)
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    showLoader();
    await signup(name, email, password, passwordConfirm);
    hideLoader();
  });

if (dataForm)
  dataForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    showLoader();
    await updateSettings({ name, email }, "data");
    hideLoader();
  });

if (passwordForm)
  passwordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const oldPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    showLoader();
    await updateSettings(
      { oldPassword, password, passwordConfirm },
      "password"
    );
    hideLoader();

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (passwordResetForm)
  passwordResetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const token = document.getElementById("token").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    showLoader();
    await resetPassword(token, password, passwordConfirm);
    hideLoader();
  });

if (passwordForgotForm)
  passwordForgotForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    showLoader();
    await forgotPassword(email);
    document.getElementById("email").value = "";
    document.getElementById("email").blur();
    hideLoader();
  });

if (logoutBtn)
  logoutBtn.addEventListener("click", async () => {
    showLoader();
    await logout();
    hideLoader();
  });

if (map) displayMap();

if (eventsBox) {
  (async function () {
    showLoader();
    eventsBox.innerHTML = "";
    const events = await getEventsWithDistance();
    events.forEach(event => {
      eventsNameList.insertAdjacentHTML(
        "beforeend",
        `<option value="${event.name}">${event.name}</option>`
      );
      addToEventsBox(event, eventsBox);
      addToMap(event);
    });
    hideLoader();
  })();

  eventsBox.addEventListener("click", async e => {
    if (e.target.classList.contains("overlay__image--open")) {
      let eventDiv = e.target.closest(".event");

      if (!eventDiv) return;

      let eventId = eventDiv.dataset.id;
      showLoader();
      await openModal(eventId, false);
      hideLoader();
    }

    if (e.target.classList.contains("overlay__image--map")) {
      let eventDiv = e.target.closest(".event");

      if (!eventDiv) return;

      let eventId = eventDiv.dataset.id;
      await moveToView(eventId);
    }
  });
}

if (searchForm)
  searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    showLoader();
    eventsBox.innerHTML = "";
    const name = searchInput.value;
    searchInput.value = "";
    searchInput.blur();
    sortInput.value = "";
    filterInput.value = "";
    const events = await getEventsWithDistance(`${name ? "name=" + name : ""}`);
    events.forEach(event => {
      addToEventsBox(event, eventsBox);
    });
    hideLoader();
  });

if (sortInput)
  sortInput.addEventListener("input", async function () {
    showLoader();
    eventsBox.innerHTML = "";
    filterInput.value = "";

    let events;

    if (sortInput.value === "") {
      events = await getEventsWithDistance();
    } else if (sortInput.value.endsWith("date")) {
      const query = sortInput.value ? `sort=${sortInput.value}` : "";
      events = await getEventsWithDistance(query);
    } else {
      events = await getEventsWithDistance();

      if (sortInput.value.startsWith("+")) {
        events.sort((a, b) => a.distance - b.distance);
      } else {
        events.sort((a, b) => b.distance - a.distance);
      }
    }

    events.forEach(event => {
      addToEventsBox(event, eventsBox);
    });

    hideLoader();
  });

const isToday = date => {
  return (
    new Date().getFullYear() === new Date(date).getFullYear() &&
    new Date().getMonth() === new Date(date).getMonth() &&
    new Date().getDate() === new Date(date).getDate()
  );
};

if (filterInput)
  filterInput.addEventListener("input", async function () {
    showLoader();
    eventsBox.innerHTML = "";
    sortInput.value = "";

    let events = await getEventsWithDistance();

    if (filterInput.value === "") {
    } else if (filterInput.value == "today") {
      events = events.filter(event => isToday(event.date));
    } else if (filterInput.value === "distance") {
      events = events.filter(event => event.distance <= 50);
    }

    events.forEach(event => {
      addToEventsBox(event, eventsBox);
    });

    hideLoader();
  });
