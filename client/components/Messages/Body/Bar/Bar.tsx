import styles from "./Bar.module.scss";
import { ChatContext } from "../../Provider";
import { useContext, useState, useCallback, useEffect } from "react";
import { GlobalContext } from "../../../../pages/_app";
import { MapContext } from "../../../Modals/Map/Provider";
import axios from "axios";

import { emitCreateMessage } from "../../../../routes/chat.routes";
import { uploadImage, UPLOAD_IMAGE_DATA } from "../../../../routes/cdn.routes";

// Icons
import PaperPlaneIcon from "../../../Svgs/PaperPlane";
import KeyboardIcon from "../../../Svgs/Keyboard";
import TimesIcon from "../../../Svgs/Times";
import FileImgIcon from "../../../Svgs/FileImg";
import MapMarkerAltIcon from "../../../Svgs/MapMarkerAlt";
import DrawPolygonIcon from "../../../Svgs/DrawPolygon";
import LoaderSpinner from "../../../Loader/Spinner/Spinner";

const Bar = () => {
  const {
    socketRef,
    ticketRef,
    selectedConnection,
    setModalCanvas,
    imgState,
    imgStateUrl,
    setImgState,
    setImgStateUrl
  } = useContext(ChatContext);
  const { setModalAskMapLocation, userAddress, userLocation } = useContext(
    MapContext
  );
  const { setArrayMsgs } = useContext(GlobalContext);

  const [text, setText] = useState<any>("");
  const [lat, setLat] = useState<any>(undefined);
  const [lng, setLng] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<any>(false);

  useEffect(() => {
    if (userAddress != "" && userLocation) {
      // When this happens it needs to create a new special msg
      setText(`This is my address: ${userAddress}`);
      setLat(userLocation.lat);
      setLng(userLocation.lng);
      if (setImgStateUrl) setImgStateUrl("");
      if (setImgState) setImgState("");
    }
  }, [userAddress, userLocation, setImgState, setImgStateUrl]);

  useEffect(() => {
    if (text == "") {
      setLat(undefined);
      setLng(undefined);
    }
  }, [text]);

  useEffect(() => {
    // Restart
    setText("");
    if (setImgState) setImgState("");
    if (setImgStateUrl) setImgStateUrl("");
    setLat(undefined);
    setLng(undefined);
    setIsLoading(false);
  }, [selectedConnection, setImgState, setImgStateUrl]);

  const handleChangeFile = (e: any) => {
    e.preventDefault();
    try {
      let urlImage: any;
      urlImage = URL.createObjectURL(e.target.files[0]);
      var allowedExtensions = /(.jpg|.jpeg|.png)$/i;
      if (!allowedExtensions.exec(e.target.value)) {
        // La imagen no tiene extension .png .jpeg o .jpg
        if (setArrayMsgs) {
          setArrayMsgs(prev => [
            {
              type: "danger",
              text: "The image needs to be .png .jpeg or .jpg"
            },
            ...prev
          ]);
        }
      } else {
        // e.target.files[0] -> input multer
        // urlImage -> url for <img src="">
        const MAX_MB: number = 100000000;
        if (e.target.files[0].size <= MAX_MB) {
          // GOOD
          if (setImgStateUrl) setImgStateUrl(urlImage);
          if (setImgState) setImgState(e.target.files[0]);
        } else {
          // BAD
          if (setArrayMsgs) {
            setArrayMsgs(prev => [
              {
                type: "danger",
                text: "The image is too big"
              },
              ...prev
            ]);
          }
        }
      }
    } catch (error) {
      console.error(error);
      // Error
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Error ocurred"
          },
          ...prev
        ]);
      }
    }
  };

  const canSend = useCallback(
    (mediaURL: string | undefined = undefined): boolean => {
      if (text && text.trim() != "") return true;
      if (mediaURL && mediaURL.trim() != "") return true;

      return false;
    },
    [text]
  );

  const uploadImageFetch = useCallback(async (): Promise<string> => {
    try {
      if (!imgState || imgState == "" || !canSend()) return "";
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", imgState);

      const response: any = await axios.post(uploadImage.url, formData, {
        withCredentials: true
      });

      setIsLoading(false);

      const data: UPLOAD_IMAGE_DATA = response.data;

      if (!data) {
        return "";
      } else {
        if (setImgState) setImgState("");
        if (setImgStateUrl) setImgStateUrl("");
        // Send msg
        return data.msg;
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Error
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Error while uploading img"
          },
          ...prev
        ]);
      }
      return "";
    }
  }, [imgState, setArrayMsgs, canSend, setImgState, setImgStateUrl]);

  const sendMessage = async () => {
    // Check for files
    if (!imgState || imgState == "") {
      sendMsgSocket();
      return;
    }
    const res = await uploadImageFetch();
    if (res != "") {
      sendMsgSocket(res);
    }
  };

  const getLangPref = () => {
    const lang: string | null = localStorage.getItem("lang");
    if (lang) return lang;

    const windowEl: any = window;
    let language: any =
      windowEl.navigator.userLanguage || windowEl.navigator.language;
    return language;
  };

  const sendMsgSocket = useCallback(
    (mediaURL: string | undefined = undefined) => {
      if (
        socketRef &&
        socketRef.current &&
        ticketRef &&
        ticketRef.current &&
        selectedConnection
      ) {
        if (canSend(mediaURL)) {
          // Gte language
          let language: any = getLangPref();

          // TODO: change with user prefs

          // At least one passes
          socketRef.current.emit(
            emitCreateMessage.method,
            ...emitCreateMessage.body(
              selectedConnection.connection.id,
              text,
              mediaURL,
              lat,
              lng,
              language
            )
          );

          setText("");
          setLat(undefined);
          setLng(undefined);
        }
      }
    },
    [lat, lng, text]
  );

  return (
    <div className={styles.bar}>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <input
          placeholder="Write a message here"
          type="text"
          name="chat"
          id="main-chat-input"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <div className={styles.controllers}>
          {isLoading && (
            <div className={styles.loader}>
              <LoaderSpinner color="lavender-300" />
            </div>
          )}
          {!isLoading && (
            <>
              <div title="Preview image uploaded" className={styles.preview}>
                {imgStateUrl != "" && (
                  <img src={imgStateUrl} alt="Image uploaded" />
                )}
              </div>
              <div
                onClick={() => {
                  if (imgStateUrl != "") {
                    if (setImgState) setImgState("");
                    if (setImgStateUrl) setImgStateUrl("");
                  }
                }}
                className={styles.upload}
                title={imgStateUrl == "" ? "Upload image" : "Cancel upload"}
              >
                {imgStateUrl == "" ? (
                  <>
                    <input
                      onChange={handleChangeFile}
                      type="file"
                      name="file"
                      id="upload-image-input-chat"
                    />
                    <label htmlFor="upload-image-input-chat">
                      {imgStateUrl != "" ? <TimesIcon /> : <FileImgIcon />}
                    </label>
                  </>
                ) : (
                  <TimesIcon />
                )}
              </div>
              <div
                onClick={() => {
                  if (setModalAskMapLocation) {
                    setModalAskMapLocation(true);
                  }
                }}
                className={styles.map}
                title="Get places"
              >
                <MapMarkerAltIcon />
              </div>
              <div
                title="Draw"
                onClick={() => {
                  if (setModalCanvas) {
                    setModalCanvas(true);
                  }
                }}
                className={styles.map}
              >
                <DrawPolygonIcon />
              </div>
              <button
                title={
                  canSend()
                    ? "Send message"
                    : "You need to write a message first"
                }
                style={{
                  cursor: canSend() ? "pointer" : "not-allowed"
                }}
                onClick={sendMessage}
              >
                {canSend() ? <PaperPlaneIcon /> : <KeyboardIcon />}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
export default Bar;
