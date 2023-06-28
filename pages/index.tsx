import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

/*
  STORE
*/
import { store } from "@/store/store";
import { Provider } from "react-redux";

/*
  COMPONENTS
*/
import { AutocompletePlaces } from "@/components/AutocompletePlaces";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <Provider store={store}>
      <Head>
        <title>Find My Place</title>
        <meta name="description" content="Find your place now" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start py-24 px-10 md:px-24 ${inter.className}`}
      >
        <AutocompletePlaces />
        <Map />
      </main>
    </Provider>
  );
}
