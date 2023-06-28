/*
    ANT DESIGN
*/
import { AutoComplete, Button } from "antd";

// TYPES
import { z } from "zod";
import { useState } from "react";
import { useDebouncedAsyncFn } from "@/lib/hooks/useDebouncedAsyncFn";

const getPlaces = async (search: string) => {
  if (search.length === 0) return [];

  try {
    const data = await fetch(
      `/api/get-places?search=${encodeURIComponent(search)}`
    ).then((res) => res.json());

    const places = z
      .object({
        places: z.array(
          z.object({
            value: z.string(),
          })
        ).optional(),
      })
      .parse(data);

    return places.places;
  } catch (error) {
    console.log("Error getting places", error);
    return [];
  }
};

interface AutocompletePlacesProps {
  onSelect?: (value: string) => void;
}
export const AutocompletePlaces = ({ onSelect }: AutocompletePlacesProps) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const [_, loading, cancel] = useDebouncedAsyncFn(
    value,
    500,
    async (value) => {
      const places = await getPlaces(value);
      setOptions(places || []);
    }
  );

  return (
    <div className="w-full flex items-center justify-center gap-3">
      <AutoComplete
        value={value}
        onChange={(value) => setValue(value)}
        onSelect={(value) => {
          onSelect?.(value);
        }}
        options={options}
        style={{ width: 300 }}
        placeholder="input here"
        allowClear
      />
      <Button
        onClick={() => {
          onSelect?.(value);
        }}
      >
        Search
      </Button>
    </div>
  );
};
