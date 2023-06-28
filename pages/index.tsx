import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// TYPES
import { z } from "zod";

const latLangSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

/*
  GOOGLE MAPS
*/
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

/*
  COMPONENTS
*/

/*
  GOOGLE LIBRARIES
*/
const LIBRARIES: ("places" | "geometry" | "drawing" | "localContext" | "visualization")[] = ["places"];

const getLatLngFromAddress = async (address: string) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await res.json();
  if (res.ok) {
    console.log(data);
    const latlang = latLangSchema.parse(data?.results[0]?.geometry?.location);

    return latlang;
  } else {
    console.log(data);
    throw new Error("Something went wrong");
  }
};

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [latLng, setLatLng] = useState({ lat: 3.101, lng: 101.584 });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleGetLatLng = async (address: string) => {
    try {
      const data = await getLatLngFromAddress(address || "Kuala Lumpur");

      setLatLng(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Next.js + TypeScript</title>
        <meta name="description" content="Next.js + TypeScript" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start py-24 px-10 md:px-24 ${inter.className}`}
      >
        {isLoaded && (
          <>
            <Autocomplete
              onPlaceChanged={() => {
                const place = inputRef.current?.value;
                if (place) {
                  handleGetLatLng(place);
                }
              }}
              restrictions={{ country: "my" }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                className="border border-gray-400 rounded-md px-4 py-2"
              />
            </Autocomplete>

            <GoogleMap
              mapContainerClassName="w-full aspect-[9/16] rounded-xl mt-10 md:aspect-[16/9]"
              center={latLng}
              zoom={15}
            >
              {" "}
            </GoogleMap>
          </>
        )}
      </main>
    </>
  );
}
