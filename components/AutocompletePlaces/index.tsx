/*
    ANT DESIGN
*/
import { AutoComplete, Button } from "antd";

// TYPES
import { useState } from "react";

/*
    STORE
*/
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getLocation } from "@/store/locationSlice";
import { getPlaces } from "@/store/placesSlice";

/*
  HOOKS
*/
import { useDebouncedAsyncFn } from "@/lib/hooks/useDebouncedAsyncFn";

interface AutocompletePlacesProps {}
export const AutocompletePlaces = ({}: AutocompletePlacesProps) => {
  // USER INPUT
  const [value, setValue] = useState("");

  // GET THE PLACES FROM THE STORE AS OPTIONS
  const { options } = useAppSelector((state) => ({
    options: state.places.places,
  }));

  // DISPATCH
  const dispatch = useAppDispatch();

  // DEBOUNCE THE USER INPUT TO LIMIT THE NUMBER OF REQUESTS
  const [_, loading, cancel] = useDebouncedAsyncFn(
    value,
    200,
    async (value) => {
      dispatch(getPlaces(value));
    }
  );

  return (
    <div className="w-full flex items-center justify-center gap-3">
      <AutoComplete
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // IF ENTERED USE THE FIRST OPTION

            setValue(options[0].value || "");
            dispatch(getLocation(options[0].value || ""));
          }
        }}
        value={value}
        onChange={(value) => setValue(value)}
        onSelect={(value) => {
          dispatch(getLocation(value));
        }}
        options={options}
        style={{ width: 500 }}
        placeholder="input here"
        allowClear
      />
      <Button
        onClick={() => {
          // IF CLICKED USE THE FIRST OPTION

          setValue(options[0].value || "");
          dispatch(getLocation(options[0].value || ""));
        }}
      >
        Search
      </Button>
    </div>
  );
};
