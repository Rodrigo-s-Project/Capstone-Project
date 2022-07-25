import { useEffect, useRef, useState } from "react";

export type LocationCoordenates = {
  lat: number;
  lng: number;
};

type Return = {
  location: LocationCoordenates;
  address: string;
  reFetch: () => void;
  isLoading: boolean;
  getAddress: (lat: number, lng: number) => Promise<string>;
};

export const useLocation = () => {
  const [conditional, setConditional] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const timeOurRef = useRef<any>(null);
  const [location, setLocation] = useState<LocationCoordenates>({
    lat: 0,
    lng: 0
  });

  const getUrlForReverseGeoCoding = (lat: number, lng: number) => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    return url;
  };

  const getAddress = async (lat: number, lng: number): Promise<string> => {
    const url = getUrlForReverseGeoCoding(lat, lng);
    var address = "";
    const res = await fetch(url);
    const data = await res.json();
    setIsLoading(false);
    if (data.results.length > 0) {
      address = data.results[0].formatted_address;
    }
    return address;
  };

  const reFetch = () => {
    try {
      if (timeOurRef.current != null) {
        clearTimeout(timeOurRef.current);
        timeOurRef.current = null;
      }
    } catch {}
    setConditional(prev => !prev);
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          const actualCoordenates: LocationCoordenates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const url = getUrlForReverseGeoCoding(
            actualCoordenates.lat,
            actualCoordenates.lng
          );

          fetch(url)
            .then(res => {
              return res.json();
            })
            .then(data => {
              setIsLoading(false);
              if (data.results.length == 0) {
                setLocation(actualCoordenates);
                setAddress("There was an error on the coordenates");
                console.error("There was an error on the coordenates: ", data);
                timeOurRef.current = setTimeout(() => {
                  reFetch();
                }, 1000);
              } else {
                setLocation(actualCoordenates);
                setAddress(data.results[0].formatted_address);
              }
            });
        },
        () => null
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Error: ", error);
      timeOurRef.current = setTimeout(() => {
        reFetch();
      }, 1000);
    }
  }, [conditional]);

  const returnData: Return = {
    location,
    address,
    reFetch,
    isLoading,
    getAddress
  };
  return returnData;
};
