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
interface LocationState {
  location: {
    lat: number;
    lng: number;
  };
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
    return latlang;
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
      state.location = action.payload;
    });
    builder.addCase(getLocation.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export default locationSlice.reducer;
