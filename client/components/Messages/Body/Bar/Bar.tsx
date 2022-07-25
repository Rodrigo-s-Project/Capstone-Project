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

const Bar = () => {
  const { socketRef, ticketRef, selectedConnection } = useContext(ChatContext);
  const { setModalAskMapLocation, userAddress } = useContext(MapContext);
  const { setArrayMsgs } = useContext(GlobalContext);

  const [text, setText] = useState<any>("");
  const [imgState, setImgState] = useState<any>("");
  const [imgStateUrl, setImgStateUrl] = useState<any>("");
  const [lat, setLat] = useState<any>(undefined);
  const [lng, setLng] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<any>(false);

  useEffect(() => {
    if (userAddress != "") {
      setText(userAddress);
    }
  }, [userAddress]);

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
          setImgStateUrl(urlImage);
          setImgState(e.target.files[0]);
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
      return (
        (text && text.trim() != "") ||
        (mediaURL && mediaURL.trim() != "") ||
        (!isNaN(lat) && !isNaN(lng))
      );
    },
    [lat, lng, text]
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
        setImgState("");
        setImgStateUrl("");
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
  }, [imgState, setArrayMsgs, canSend]);

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

  const sendMsgSocket = (mediaURL: string | undefined = undefined) => {
    if (
      socketRef &&
      socketRef.current &&
      ticketRef &&
      ticketRef.current &&
      selectedConnection
    ) {
      if (canSend(mediaURL)) {
        // At least one passes
        socketRef.current.emit(
          emitCreateMessage.method,
          ...emitCreateMessage.body(
            selectedConnection.connection.id,
            text,
            mediaURL,
            lat,
            lng
          )
        );

        setText("");
        setLat(undefined);
        setLng(undefined);
      }
    }
  };

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
        <div className={styles.preview}>
          {imgStateUrl != "" && <img src={imgStateUrl} alt="Image uploaded" />}
        </div>
        <div
          onClick={() => {
            if (imgStateUrl != "") {
              setImgState("");
              setImgStateUrl("");
            }
          }}
          className={styles.upload}
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
        >
          <MapMarkerAltIcon />
        </div>
        <button
          title="Send message"
          style={{
            cursor: canSend() ? "pointer" : "not-allowed"
          }}
          onClick={sendMessage}
        >
          {canSend() ? <PaperPlaneIcon /> : <KeyboardIcon />}
        </button>
      </form>
    </div>
  );
};
export default Bar;
