import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "./locationSlice";
import placesReducer from "./placesSlice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    places: placesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
