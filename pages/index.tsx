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
import { AutocompletePlaces } from "@/components/AutocompletePlaces";
import { useStore } from "@/store/store";

/*
  COMPONENTS
*/

/*
  GOOGLE LIBRARIES
*/
const LIBRARIES: (
  | "places"
  | "geometry"
  | "drawing"
  | "localContext"
  | "visualization"
)[] = ["places"];

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

  const { location } = useStore((state) => ({ location: state.location }));

  return (
    <>
      <Head>
        <title>Next.js + TypeScript</title>
        <meta name="description" content="Next.js + TypeScript" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start py-24 px-10 md:px-24 ${inter.className}`}
      >
        <AutocompletePlaces />

        {isLoaded && (
          <>
            <GoogleMap
              mapContainerClassName="w-full aspect-[9/16] rounded-xl mt-10 md:aspect-[16/9]"
              center={location}
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
