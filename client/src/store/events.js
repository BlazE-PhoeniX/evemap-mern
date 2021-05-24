import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAll } from "../hooks/use-input";
import { showAlert, showLoader, hideLoader } from "./ui";

const initialState = {
  events: [],
};

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    replaceEvents(state, action) {
      const coords = action.payload.coords;
      const events = action.payload.events;

      if (coords) {
        events.forEach(event => {
          event.distance = Math.round(
            distance(
              coords.lat,
              coords.lng,
              event.location.coordinates[1],
              event.location.coordinates[0],
              "K"
            )
          );
        });
      }

      state.events = events;
    },

    addEvent(state, action) {
      const coords = action.payload.coords;
      const event = action.payload.event;

      if (coords) {
        event.distance = Math.round(
          distance(
            coords.lat,
            coords.lng,
            event.location.coordinates[1],
            event.location.coordinates[0],
            "K"
          )
        );
      }

      state.events.push(event);
    },

    changeEvent(state, action) {
      const coords = action.payload.coords;
      const event = action.payload.event;

      if (coords) {
        event.distance = Math.round(
          distance(
            coords.lat,
            coords.lng,
            event.location.coordinates[1],
            event.location.coordinates[0],
            "K"
          )
        );
      }

      const index = state.events.findIndex(eve => eve.id === event.id);
      state.events[index] = event;
    },

    removeEvent(state, action) {
      const eventId = action.payload.id;
      state.events = state.events.filter(event => event.id !== eventId);
    },
  },
});

export const eventsActions = eventsSlice.actions;

export default eventsSlice.reducer;

export const getAllEvents = (coords, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    let events = [];
    // if (token) {
    if (user) {
      try {
        dispatch(showLoader());
        const res = await axios.get(`/api/v1/events`, {
          // headers: {
          // authorization: "Bearer " + token,
          // },
        });

        events = res.data.data.events;
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      dispatch(hideLoader());
      dispatch(eventsActions.replaceEvents({ events, coords }));
    }
  };
};

export const postOneEvent = (event, coords, closeModal, user) => {
  return async dispatch => {
    const eventDate = new Date(`${event.date.value}T${event.time.value}`);
    // const token = localStorage.getItem("jwt");
    // if (token) {
    if (user) {
      let res;
      try {
        dispatch(showLoader());
        res = await axios.post(
          "/api/v1/events",
          {
            name: event.name.value,
            date: eventDate,
            description: event.description.value,
            location: {
              type: "Point",
              coordinates: [+event.lng.value, +event.lat.value],
              address: event.address.value,
            },
          }
          // {
          //   headers: {
          //     authorization: "Bearer " + token,
          //   },
          // }
        );

        dispatch(showAlert("success", res.data.message));
        const eve = res.data.data.event;
        dispatch(eventsActions.addEvent({ event: eve, coords }));
        closeModal();
        resetAll(
          event.name,
          event.date,
          event.time,
          event.description,
          event.address
        );
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      dispatch(hideLoader());
    }
  };
};

export const updateOneEvent = (event, coords, closeModal, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    const eventDate = new Date(`${event.date.value}T${event.time.value}`);
    // if (token) {
    if (user) {
      let res;
      try {
        dispatch(showLoader());
        res = await axios.patch(
          `/api/v1/events/${event.id.value}`,
          {
            name: event.name.value,
            date: eventDate,
            description: event.description.value,
            location: {
              type: "Point",
              coordinates: [+event.lng.value, +event.lat.value],
              address: event.address.value,
            },
          }
          // {
          //   headers: {
          //     authorization: "Bearer " + token,
          //   },
          // }
        );

        dispatch(showAlert("success", res.data.message));
        const eve = res.data.data.event;
        dispatch(eventsActions.changeEvent({ event: eve, coords }));

        resetAll(
          event.name,
          event.date,
          event.time,
          event.description,
          event.address
        );

        closeModal();
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      dispatch(hideLoader());
    }
  };
};

export const deleteOneEvent = (eventId, closeModal, user) => {
  return async dispatch => {
    // const token = localStorage.getItem("jwt");
    // if (token) {
    if (user) {
      try {
        dispatch(showLoader());
        const res = await axios.delete(`/api/v1/events/${eventId}`, {
          // headers: {
          // authorization: "Bearer " + token,
          // },
        });

        dispatch(showAlert("success", res.data.message));
        dispatch(eventsActions.removeEvent({ id: eventId }));
        closeModal();
      } catch (err) {
        dispatch(showAlert("error", err.response.data.message));
      }
      dispatch(hideLoader());
    }
  };
};
