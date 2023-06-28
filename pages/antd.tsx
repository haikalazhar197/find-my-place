import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

/*
    ANT DESIGN
*/
import { AutoComplete, Button, Spin } from "antd";

// TYPES
import { z } from "zod";
import { useState } from "react";
import { useDebouncedAsyncFn } from "@/lib/hooks/useDebouncedAsyncFn";

const latLangSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

/*
  COMPONENTS
*/

/*
    SLEEP FUNCTION
*/
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// MOCK DATA
const places = [
  "Kuala Lumpur",
  "Petaling Jaya",
  "Shah Alam",
  "Klang",
  "Subang Jaya",
  "Kajang",
  "Cheras",
  "Selayang",
  "Rawang",
];

export default function Home() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const [_, loading, cancel] = useDebouncedAsyncFn(
    value,
    500,
    async (value) => {
      if (value) {
        console.log("Searching for", value);
        await sleep(1000);
        setOptions(
          places
            .filter((place) =>
              place.toLowerCase().includes(value.toLowerCase())
            )
            .map((place) => ({ value: place }))
        );
      } else {
        setOptions([]);
      }
    }
  );

  return (
    <>
      <Head>
        <title>With Ant Design</title>
        <meta name="description" content="With Ant Design" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start py-24 px-10 md:px-24 ${inter.className}`}
      >
        <div className="w-full max-w-3xl flex items-center justify-center gap-3">
          <AutoComplete
            value={value}
            onChange={(value) => setValue(value)}
            onSelect={(value) => {
              console.log("Selected value", value);
            }}
            // onSearch={(value) =>
            //   setOptions(
            //     value
            //       ? places
            //           .filter((place) =>
            //             place.toLowerCase().includes(value.toLowerCase())
            //           )
            //           .map((place) => ({ value: place }))
            //       : []
            //   )
            // }
            options={options}
            style={{ width: 200 }}
            placeholder="input here"
            allowClear
          />
          <Button>Search</Button>
        </div>
      </main>
    </>
  );
}
