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
import { SearchHistory } from "@/components/SearchHistory";

export default function Home() {
  return (
    <Provider store={store}>
      <Head>
        <title>Find My Place</title>
        <meta name="description" content="Find your place now" />
      </Head>

      <main
        className={`flex min-h-screen flex-col items-center justify-start md:py-24 py-10 px-10 md:px-24 ${inter.className}`}
      >
        <SearchHistory />

        <div className="w-full max-w-3xl text-center space-y-2">
          <h2 className="font-semibold text-gray-700 text-4xl md:text-6xl">
            Find My Place
          </h2>
          <p className="font-normal text-base md:text-lg text-gray-700">
            This is a simple app to find your place using Google Maps API
          </p>
        </div>

        <section className="mt-10 w-full">
          <AutocompletePlaces />
          <Map />
        </section>
      </main>
    </Provider>
  );
}
