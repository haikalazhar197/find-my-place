import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/*
  SCHEMA
*/
import { z } from "zod";
const latLangSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

/*
  TYPES
*/
interface Location {
  lat: number;
  lng: number;
  place_address?: string;
}

interface LocationState {
  location: Location;
  history: Location[];
  pending: boolean;
  error: boolean;
}

/*
  INITIAL STATE
*/
const initialState: LocationState = {
  location: {
    lat: 3.101,
    lng: 101.584,
  },
  history: [],
  pending: false,
  error: false,
};

/*
  THUNKS
*/
export const getLocation = createAsyncThunk(
  "location/getLocation",
  async (address: string) => {
    // MASK THE UNDERLYING API CALL
    const res = await fetch(
      `/api/get-location?search=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    const latlang = latLangSchema.parse(data?.location);
    return {
      location: { ...latlang, place_address: address },
    };
  }
);

/*
  REDUCER
*/
export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLocation.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(getLocation.fulfilled, (state, action) => {
      state.pending = false;
      state.error = false;

      const location = action.payload.location;
      const history = state.history;
      const isDuplicate = history.some(
        (item) => item.place_address === location.place_address
      );

      state.location = action.payload.location;
      state.history = isDuplicate ? history : [location, ...history];
    });
    builder.addCase(getLocation.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export default locationSlice.reducer;
