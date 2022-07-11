import PopUpModal from "../PopUp/PopUp";
import styles from "./UploadImage.module.scss";
import { useContext, useCallback, useState } from "react";
import { GlobalContext } from "../../../pages/_app";
import { uploadImage, UPLOAD_IMAGE_DATA } from "../../../routes/cdn.routes";
import axios from "axios";
import ButtonSpinner from "../../Buttons/BtnClick/BtnClick";

export type ModalProps = {
  callback: (data: UPLOAD_IMAGE_DATA) => any;
};

const UploadImage = ({ callback }: ModalProps) => {
  const [imgState, setImgState] = useState<any>("");
  const [imgStateUrl, setImgStateUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    setModalPopUpImages,
    modalPopUpImages,
    setArrayMsgs,
    callBackImages
  } = useContext(GlobalContext);

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

  const uploadImageFetch = useCallback(async () => {
    try {
      if (!imgState || imgState == "") return;
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", imgState);

      const response: any = await axios.post(uploadImage.url, formData, {
        withCredentials: true
      });

      setIsLoading(false);

      const data: UPLOAD_IMAGE_DATA = response.data;

      if (!data) {
      } else {
        if (setModalPopUpImages) setModalPopUpImages(false);

        callback(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Error
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error!"
          },
          ...prev
        ]);
      }
    }
  }, [imgState, callback, setArrayMsgs, setModalPopUpImages]);

  const clearData = () => {
    setImgState("");
    setImgStateUrl("");
    try {
      if (callBackImages && callBackImages.current) {
        callBackImages.current = null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PopUpModal
      callbackClose={clearData}
      isModal={modalPopUpImages}
      setIsModal={setModalPopUpImages}
    >
      <div className={styles.upload_title}>Upload image</div>
      <div className={styles.upload}>
        <input
          onChange={handleChangeFile}
          type="file"
          name="file"
          id="upload-image-input"
        />
        <div className={styles.upload_rules}>
          Upload an (.png .jpeg or .jpg) image
        </div>
        <label htmlFor="upload-image-input">
          <ButtonSpinner
            text="Upload file"
            color="lavender-300"
            border="round_5"
            additionalClass="btn-files"
            isDiv
          />
        </label>
      </div>
      {imgStateUrl != "" && (
        <>
          <div className={styles.preview}>
            <div className={styles.preview_title}>Image preview:</div>
            <img src={imgStateUrl} alt="Image uploaded" />
          </div>
          <div className={styles.send}>
            <ButtonSpinner
              text="Upload image"
              callback={uploadImageFetch}
              color="lavender-300"
              border="round_5"
              additionalClass="btn-send-files"
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </PopUpModal>
  );
};

export default UploadImage;
