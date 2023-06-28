import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/*
  SCHEMA
*/
import { z } from "zod";
const placesSchema = z.object({
  places: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
});

/*
  TYPES
*/
interface PlaceState {
  places: {
    value: string;
  }[];
  pending: boolean;
  error: boolean;
}

/*
  INITIAL STATE
*/
const initialState: PlaceState = {
  places: [],
  pending: false,
  error: false,
};

/*
  THUNKS
*/
export const getPlaces = createAsyncThunk(
  "places/getPlaces",
  async (search: string) => {
    if (search.length === 0) return [];

    try {
      // MASK THE UNDERLYING API CALL
      const data = await fetch(
        `/api/get-places?search=${encodeURIComponent(search)}`
      ).then((res) => res.json());

      const places = placesSchema.parse(data);

      return places.places;
    } catch (error) {
      throw new Error("Error fetching places");
    }
  }
);

/*
  REDUCER
*/
export const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlaces.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(getPlaces.fulfilled, (state, action) => {
      state.pending = false;
      state.error = false;
      state.places = action.payload || [];
    });
    builder.addCase(getPlaces.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export default placesSlice.reducer;
