import { showAlert } from "./alert";
import { showLoader, hideLoader } from "./loader";

const modelBG = document.querySelector(".modal-bg");
const model = document.querySelector(".modal");
const idInput = document.querySelector("#event-id");
const latInput = document.querySelector("#event-lat");
const lngInput = document.querySelector("#event-lng");
const nameInput = document.querySelector("#event-name");
const dateInput = document.querySelector("#event-date");
const timeInput = document.querySelector("#event-time");
const descInput = document.querySelector("#event-desc");
const addrInput = document.querySelector("#event-addr");

const editBtn = document.querySelector(".model__btn--edit");
const saveBtn = document.querySelector(".model__btn--save");
const deleteBtn = document.querySelector(".model__btn--delete");

const mapsLink = document.querySelector(".maps-link");

const defillInputs = (...inputs) => {
  inputs.forEach(input => {
    input.value = "";
  });
};

const addReadOnly = (...inputs) => {
  inputs.forEach(input => {
    input.setAttribute("readonly", "true");
  });
};
const removeReadOnly = (...inputs) => {
  inputs.forEach(input => {
    input.removeAttribute("readonly");
  });
};

const prefixZero = number => {
  return number < 10 ? `0${number}` : `${number}`;
};

const hideButtons = (save, edit, maps) => {
  saveBtn.style.display = save;
  editBtn.style.display = edit;
  mapsLink.style.display = maps;
};

export const openModal = async function (
  eventId = "",
  editMode = true,
  coords
) {
  defillInputs(
    idInput,
    latInput,
    lngInput,
    nameInput,
    dateInput,
    timeInput,
    descInput,
    addrInput
  );
  mapsLink.href = "#";

  if (editMode) {
    removeReadOnly(
      idInput,
      latInput,
      lngInput,
      nameInput,
      dateInput,
      timeInput,
      descInput,
      addrInput
    );
    hideButtons("block", "none", "none");
  } else {
    addReadOnly(
      idInput,
      latInput,
      lngInput,
      nameInput,
      dateInput,
      timeInput,
      descInput,
      addrInput
    );
    hideButtons("none", "block", "block");
  }

  if (eventId !== "") {
    try {
      const res = await (await fetch(`/api/v1/events/${eventId}`)).json();
      const event = res.data.event;

      event.date = new Date(event.date);

      idInput.value = event.id;
      nameInput.value = event.name;

      dateInput.value = `${event.date.getFullYear()}-${prefixZero(
        event.date.getMonth() + 1
      )}-${prefixZero(event.date.getDate())}`;

      timeInput.value = `${prefixZero(event.date.getHours())}:${prefixZero(
        event.date.getMinutes()
      )}:00`;

      descInput.value = event.description;
      addrInput.value = event.location.address;
      latInput.value = event.location.coordinates[1];
      lngInput.value = event.location.coordinates[0];

      mapsLink.href = `https://www.google.co.in/maps/@${event.location.coordinates[1]},${event.location.coordinates[0]},18z`;
    } catch (err) {
      showAlert("error", err.message);
      return;
    }
  }

  console.log(coords);
  if (editMode && coords) {
    latInput.value = coords.lat;
    lngInput.value = coords.lng;
  }

  if (getComputedStyle(modelBG).getPropertyValue("visibility") === "hidden") {
    modelBG.style.visibility = "visible";
    modelBG.style.transform = "none";
  }
};

export const openModalToAdd = async function (coords) {
  defillInputs(
    idInput,
    latInput,
    lngInput,
    nameInput,
    dateInput,
    timeInput,
    descInput,
    addrInput
  );
  mapsLink.href = "#";

  removeReadOnly(
    idInput,
    latInput,
    lngInput,
    nameInput,
    dateInput,
    timeInput,
    descInput,
    addrInput
  );
  hideButtons("block", "none", "none");

  if (coords) {
    latInput.value = coords.lat;
    lngInput.value = coords.lng;
  }

  if (getComputedStyle(modelBG).getPropertyValue("visibility") === "hidden") {
    modelBG.style.visibility = "visible";
    modelBG.style.transform = "none";
  }
};

export const closeModal = function () {
  modelBG.style.transform = "translateY(-100%)";
  setTimeout(() => {
    modelBG.style.visibility = "hidden";
  }, 500);
};

if (model) {
  model.querySelector("span").addEventListener("click", closeModal);
}

if (editBtn)
  editBtn.addEventListener("click", async function () {
    const eventId = idInput.value;
    showLoader();
    openModal(eventId, true);
    hideLoader();
  });

if (deleteBtn)
  deleteBtn.addEventListener("click", async function () {
    const eventId = idInput.value;
    showLoader();
    try {
      const res = await (
        await fetch(`/api/v1/events/${eventId}`, {
          method: "DELETE",
        })
      ).json();

      if (res.status === "sucess") {
        showAlert("success", res.message);
        closeModal();
        setTimeout(function () {
          location.reload();
        }, 500);
      } else {
        showAlert("error", res.message);
      }
    } catch (err) {
      showAlert("error", err.message);
    }
    hideLoader();
  });

if (saveBtn)
  saveBtn.addEventListener("click", async function () {
    const eventId = idInput.value;

    showLoader();

    let res;
    if (eventId !== "") {
      try {
        res = await (
          await fetch(`/api/v1/events/${eventId}`, {
            method: "PATCH",
            body: JSON.stringify({
              name: nameInput.value,
              date: new Date(`${dateInput.value}T${timeInput.value}`),
              description: descInput.value,
              location: {
                type: "Point",
                coordinates: [lngInput.value * 1, latInput.value * 1],
                address: addrInput.value,
              },
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (res.status === "success") {
          showAlert("success", res.message);
          setTimeout(function () {
            location.reload();
          }, 500);
          closeModal();
        } else {
          showAlert("error", res.message);
        }
      } catch (err) {
        showAlert("error", err.message);
        console.log(err.message);
      }
    } else {
      try {
        const res = await axios.post("/api/v1/events", {
          name: nameInput.value,
          date: new Date(`${dateInput.value}T${timeInput.value}`),
          description: descInput.value,
          location: {
            type: "Point",
            coordinates: [lngInput.value * 1, latInput.value * 1],
            address: addrInput.value,
          },
        });

        if (res.data.status === "success") {
          showAlert("success", res.data.message);
          setTimeout(() => {
            location.reload();
          }, 500);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      }
    }

    hideLoader();
  });
