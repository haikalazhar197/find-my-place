import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoBoxF,
} from "@react-google-maps/api";

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

/*
  STORE
*/
import { useAppSelector } from "@/store/hooks";

export const Map = () => {
  // LOAD THE GOOGLE MAPS API SCRIPT
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  // GET THE LOCATION FROM THE STORE
  const { location } = useAppSelector((state) => ({
    location: state.location,
  }));

  // IF THE MAP IS NOT LOADED RETURN NULL AS THE CHILDREN
  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerClassName="w-full aspect-[9/16] rounded-xl mt-10 md:aspect-[16/9]"
      center={location.location}
      zoom={15}
    >
      {location.location.place_address && (
        <MarkerF position={location.location} />
      )}
    </GoogleMap>
  );
};
