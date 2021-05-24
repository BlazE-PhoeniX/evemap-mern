import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import eventsReducer from "./events";
import coordsReducer from "./coords";
import uiReducer from "./ui";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    coords: coordsReducer,
    ui: uiReducer,
  },
});

export default store;
