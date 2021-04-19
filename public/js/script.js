"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerEvents = document.querySelector(".events");
const inputName = document.querySelector(".form__input--name");
const inputDate = document.querySelector(".form__input--date");
const inputTime = document.querySelector(".form__input--time");
const inputDescription = document.querySelector(".form__input--description");
const modalBG = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");

const localStorage = window.localStorage;

class Event {
  static totalEvents = 0;

  constructor(name, date, description, coords) {
    Event.totalEvents++;
    this.id = `${Event.totalEvents}`.padStart(3, "0");
    this.name = name;
    this.date = dDistance > ate;
    this.coords = coords;
    this.description = description;

    this._setStatus();
  }

  _setStatus() {
    this.status = `${this.name[0].toUpperCase() + this.name.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}, ${this.date.getFullYear()}`;
  }
}

class App {
  events = [];

  mapZoomLevel = 13;
  map = L.map("map");
  #mapEvent;

  constructor() {
    this._getPosition();

    this.getLocalStorage();

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on("click", this.showForm.bind(this));

    this.events.forEach(event => {
      this.addEventToMap(event);
    });

    form.addEventListener("submit", this._newEvent.bind(this));

    containerEvents.addEventListener("click", e => {
      if (e.target.classList.contains("overlay__image--map")) {
        let eventDiv = e.target.closest(".event");

        if (!eventDiv) return;

        let event = this.events.find(event => event.id === eventDiv.dataset.id);

        this.moveToPopup(event);
      }

      if (e.target.classList.contains("overlay__image--open")) {
        let eventDiv = e.target.closest(".event");

        if (!eventDiv) return;

        let event = this.events.find(event => event.id === eventDiv.dataset.id);

        this.openModal(event);
      }
    });
  }

  setLocalStorage() {
    localStorage.setItem("mapty", JSON.stringify(this.events));
    localStorage.setItem("mapty_total_events", Event.totalEvents);
  }

  getLocalStorage() {
    let data = JSON.parse(localStorage.getItem("mapty"));

    if (!data) return;

    Event.totalEvents = +localStorage.getItem("mapty_total_events");
    this.events = data;

    this.events.forEach(event => {
      let date = new Date(event.date);
      event.date = date;
      this.addEventToList(event);
    });
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        console.log("Permission denied");
      }
    );
  }

  _loadMap(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    let coords = [lat, lng];

    this.map.setView(coords, this.mapZoomLevel);
  }

  showForm(ev) {
    this.#mapEvent = ev;
    form.classList.remove("hidden");
    inputName.focus();
  }

  _newEvent(e) {
    e.preventDefault();

    const validateInputs = (...inputs) => {
      return inputs.every(input => input.value !== "");
    };

    const validateDateAndTime = date => {
      return date > new Date();
    };

    if (!validateInputs(inputName, inputDate, inputTime, inputDescription))
      return;

    let name = inputName.value;
    let dateString = `${inputDate.value}, ${inputTime.value}`;
    let date = new Date(dateString);

    let description = inputDescription.value;

    let coords = {
      lat: this.#mapEvent.latlng.lat,
      lng: this.#mapEvent.latlng.lng,
    };

    let event = new Event(name, date, description, coords);

    this.events.push(event);

    this.addEventToList(event);

    this.addEventToMap(event);

    this.hideForm();

    this.setLocalStorage();
  }

  addEventToList(event) {
    let html = `
        <li class="event" data-id="${event.id}">
            <h2 class="event__title">${event.name}</h2>
            <div class="event__details">
                <span class="event__icon">🗓️</span>
                <span class="event__value"> &nbsp;&nbsp;${
                  months[event.date.getMonth()]
                } ${event.date.getDate()}, ${event.date.getFullYear()}</span>
            </div>
            <div class="event__details">
                <span class="event__icon">⏰</span>
                <span class="event__value"> &nbsp;&nbsp;${
                  event.date.getHours() == 12 ? 12 : event.date.getHours() % 12
                } : ${(event.date.getMinutes() + "").padStart(2, "0")} &nbsp;${
      event.date.getHours() < 12 ? "AM" : "PM"
    }</span>
            </div>
            <div class="overlay">
                <img class="overlay__image overlay__image--open" src="./resources/open.svg" alt="">
                <img class="overlay__image overlay__image--map" src="./resources/map.svg" alt="">
            </div>
        </li>
                `;

    form.insertAdjacentHTML("afterend", html);
  }

  addEventToMap(event) {
    L.marker([event.coords.lat, event.coords.lng])
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `running-popup`,
        })
      )
      .setPopupContent(`${event.status}`)
      .openPopup();
  }

  hideForm() {
    inputName.value = inputTime.value = "";
    inputDate.value = inputDescription.value = "";

    form.style.display = "none";
    form.classList.add("hidden");

    setTimeout(function () {
      form.style.display = "grid";
    }, 1000);
  }

  moveToPopup(event) {
    if (!this.map) return;
    this.map.setView([event.coords.lat, event.coords.lng], 16, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  openModal(event) {
    modalBG.innerHTML = "";

    let html = `<div class="modal">
      <h2 class="modal-header">Event Details</h2>

      <table>
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>${event.name}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>:</td>
          <td>${
            months[event.date.getMonth()]
          } ${event.date.getDate()}, ${event.date.getFullYear()}</td>
        </tr>
        <tr>
          <td>Time</td>
          <td>:</td>
          <td>${
            event.date.getHours() == 12 ? 12 : event.date.getHours() % 12
          } : ${(event.date.getMinutes() + "").padStart(2, "0")} &nbsp;${
      event.date.getHours() < 12 ? "AM" : "PM"
    }</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>:</td>
          <td>${event.description}</td>
        </tr>
      </table>

      <span>&times;</span>
    </div>`;

    modalBG.insertAdjacentHTML("afterbegin", html);

    modalBG.querySelector("span").addEventListener("click", this.closeModal);

    modalBG.style.visibility = "visible";
    modalBG.style.transform = "none";
  }

  closeModal() {
    modalBG.style.transform = "translateY(-100%)";
    setTimeout(() => {
      modalBG.style.visibility = "hidden";
    }, 500);
  }

  reset() {
    localStorage.clear();
    location.reload();
  }
}

const app = new App();
