import { create } from "zustand";
import { persist } from "zustand/middleware";

// TYPES
import { z } from "zod";

const latLangSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

interface Store {
  location: {
    lat: number;
    lng: number;
  };
  error: string;
  isError: boolean;
  setLocation: (lat: number, lng: number) => void;
  getLocation: (address: string) => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      error: "",
      isError: false,
      location: {
        lat: 3.101,
        lng: 101.584,
      },
      setLocation: (lat, lng) => set(() => ({ location: { lat, lng } })),
      getLocation: async (address) => {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          const latlang = latLangSchema.parse(
            data?.results[0]?.geometry?.location
          );

          set({
            location: {
              ...latlang,
            },
          });
        } else {
          console.log(data);
          set({
            error: "An error occured while fetching location",
            isError: true,
          });
        }
      },
    }),
    {
      name: "location-storage",
    }
  )
);

// export const useLocation = () => {
//     const { location, setLocation, getLocation } = useStore();
//     return { location, setLocation, getLocation };
// }