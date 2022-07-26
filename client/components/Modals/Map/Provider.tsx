import { createContext, useState, Dispatch, SetStateAction } from "react";
import { LocationCoordenates } from "../../../hooks/useLocation";

type Props = {
  children: any;
};

export const MapContext = createContext<Partial<MapApp>>({});

interface MapApp {
  modalAskMapLocation: boolean;
  setModalAskMapLocation: Dispatch<SetStateAction<boolean>>;
  userLocation: LocationCoordenates;
  setUserLocation: Dispatch<SetStateAction<LocationCoordenates>>;
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
}

const ProviderMap = ({ children }: Props) => {
  const [modalAskMapLocation, setModalAskMapLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoordenates>({
    lat: 0,
    lng: 0
  });
  const [userAddress, setUserAddress] = useState("");

  return (
    <MapContext.Provider
      value={{
        modalAskMapLocation,
        setModalAskMapLocation,
        userLocation,
        setUserLocation,
        userAddress,
        setUserAddress
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default ProviderMap;
