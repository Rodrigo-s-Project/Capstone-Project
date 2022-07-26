import styles from "./MapModal.module.scss";
import TimesIcon from "../../Svgs/Times";
import MapMarker from "../../Svgs/MapMarkerAlt";
import { useContext, useState, useCallback, useRef, useEffect } from "react";
import { MapContext } from "../../Modals/Map/Provider";
import BtnSpinner from "../../Buttons/BtnClick/BtnClick";
import { useLocation, LocationCoordenates } from "../../../hooks/useLocation";
import Loader from "../../Loader/Spinner/Spinner";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { ChatContext } from "../../Messages/Provider";

export default function ContactModal() {
  const {
    modalAskMapLocation,
    setModalAskMapLocation,
    setUserLocation,
    setUserAddress
  } = useContext(MapContext);
  const { selectedConnection } = useContext(ChatContext);

  const {
    address,
    isLoading: isLoadingCoordenates,
    location,
    getAddress,
    getLocation,
    restart
  } = useLocation();

  // Phases
  const [isMap, setIsMap] = useState(false);

  // Map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
  });

  // Ref
  const mapRef = useRef<any>();

  const onMapload = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
  }, []);

  // Marker
  const [marker, setMarker] = useState<LocationCoordenates | false>(false);

  const onMapClick = useCallback((event: any) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, []);

  const getPixelPositionOffset = (
    width: number,
    height: number
  ): { x: number; y: number } => ({
    x: -(width / 2),
    y: -(height + 10)
  });

  useEffect(() => {
    if (modalAskMapLocation) {
      // Is on screen
      getLocation(); // Call fetcher
    } else {
      restart(); // Delete prev data
      if (setUserLocation)
        setUserLocation({
          lat: 0,
          lng: 0
        });
      if (setUserAddress) setUserAddress("");
    }
  }, [modalAskMapLocation, selectedConnection]);

  return (
    <div
      className={`${styles.black} ${!modalAskMapLocation &&
        styles.black_close}`}
    >
      {!isMap && (
        <div className={`${styles.card}`}>
          <div className={`${styles.orange_card}`}></div>
          <button
            onClick={() => {
              if (setModalAskMapLocation) {
                setModalAskMapLocation(false);
              }
            }}
            className={styles.btn_x}
            title="Close"
          >
            <TimesIcon className={styles.x} />
          </button>
          <div className={`${styles.title}`}>Location in Google Maps</div>
          <div className={`${styles.text}`}>We had located your address</div>
          <div className={`${styles.info}`}>
            {isLoadingCoordenates && (
              <Loader color="lavender-300" additionalClass="loader-svg" />
            )}
            {!isLoadingCoordenates && address}
          </div>
          <BtnSpinner
            text="Use this location"
            callback={() => {
              if (setUserLocation && setUserAddress && setModalAskMapLocation) {
                setUserLocation(location);
                setUserAddress(address);
                setModalAskMapLocation(false);
              }
            }}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-map"
          />
          <BtnSpinner
            text="Use another one"
            callback={() => {
              setIsMap(true);
            }}
            color="gray"
            border="round_5"
            additionalClass="btn-map"
          />
        </div>
      )}
      {isMap && isLoaded && (
        <>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%"
            }}
            center={location}
            zoom={18}
            onLoad={onMapload}
            onClick={onMapClick}
            onUnmount={onUnmount}
          >
            {marker && (
              <OverlayView
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                position={{
                  lat: marker.lat,
                  lng: marker.lng
                }}
                getPixelPositionOffset={getPixelPositionOffset}
              >
                <div className={styles.mapOverlay}>
                  <MapMarker />
                </div>
              </OverlayView>
            )}
            {marker && (
              <BtnSpinner
                text="Save"
                callback={async () => {
                  if (
                    setUserLocation &&
                    setUserAddress &&
                    setModalAskMapLocation
                  ) {
                    const addressMarker: string = await getAddress(
                      marker.lat,
                      marker.lng
                    );
                    setUserLocation(marker);
                    setUserAddress(addressMarker);
                    setModalAskMapLocation(false);
                    setIsMap(false);
                    setMarker(false);
                  }
                }}
                color="lavender-300"
                border="round_5"
                additionalClass="btn-map-save"
              />
            )}
            <TimesIcon
              _click={() => {
                setIsMap(false);
                setMarker(false);
              }}
              className={styles.timesIcon}
            />
          </GoogleMap>
        </>
      )}
    </div>
  );
}
