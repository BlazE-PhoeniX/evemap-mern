import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alert: {
    show: false,
    type: "",
    message: "",
  },
  loader: {
    show: false,
  },
  coordsGetter: {
    show: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showAlert(state, action) {
      state.alert.show = true;
      state.alert.type = action.payload.type;
      state.alert.message = action.payload.message;
    },

    hideAlert(state, action) {
      state.alert = initialState;
    },

    showLoader(state, action) {
      state.loader.show = true;
    },

    hideLoader(state, action) {
      state.loader.show = false;
    },

    showCoordsGetter(state, action) {
      state.coordsGetter.show = true;
    },

    hideCoordsGetter(state, action) {
      state.coordsGetter.show = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;

export const showAlert = (type, message) => {
  return dispatch => {
    dispatch(uiActions.showAlert({ type, message }));

    setTimeout(() => {
      dispatch(uiActions.hideAlert());
    }, 1500);
  };
};

export const showLoader = () => {
  return dispatch => {
    dispatch(uiActions.showLoader());
  };
};

export const hideLoader = () => {
  return dispatch => {
    dispatch(uiActions.hideLoader());
  };
};

export const showCoordsGetter = () => {
  return dispatch => {
    dispatch(uiActions.showCoordsGetter());
  };
};

export const hideCoordsGetter = () => {
  return dispatch => {
    dispatch(uiActions.hideCoordsGetter());
  };
};
