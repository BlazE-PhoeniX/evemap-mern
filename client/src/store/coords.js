import { createSlice } from "@reduxjs/toolkit";
import { showCoordsGetter } from "./ui";

const initialState = {
  lat: null,
  lng: null,
};

const coordsSlice = createSlice({
  name: "coords",
  initialState,
  reducers: {
    addCoords(state, action) {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },

    removeCoords(state, action) {
      state.lat = null;
      state.lng = null;
    },
  },
});

export const coordsActions = coordsSlice.actions;

export default coordsSlice.reducer;

export const getCoords = () => {
  return async dispatch => {
    let coords;
    try {
      coords = await new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          function (e) {
            resolve(e.coords);
          },
          function () {
            reject(new Error("Location permission denied"));
          },
          {
            enableHighAccuracy: true,
          }
        );
      });
    } catch (err) {
      console.log(err.message);
    }

    if (coords) {
      dispatch(
        coordsActions.addCoords({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      );
    } else if (localStorage.getItem("coords")) {
      const coords = localStorage.getItem("coords");

      const lat = +coords.split(",")[0].trim();
      const lng = +coords.split(",")[1].trim();

      dispatch(
        coordsActions.addCoords({
          lat,
          lng,
        })
      );
    } else {
      dispatch(showCoordsGetter());
    }
  };
};
