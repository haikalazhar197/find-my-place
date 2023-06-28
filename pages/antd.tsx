import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

import { AutocompletePlaces } from "@/components/AutocompletePlaces";

export default function Home() {
  return (
    <>
      <Head>
        <title>With Ant Design</title>
        <meta name="description" content="With Ant Design" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start py-24 px-10 md:px-24 ${inter.className}`}
      >
        <AutocompletePlaces
          onSelect={(value) => {
            console.log("Searched value", value);
          }}
        />
      </main>
    </>
  );
}
