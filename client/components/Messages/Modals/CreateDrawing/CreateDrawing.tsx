import styles from "./CreateDrawing.module.scss";
import { useContext, useRef, useState, useEffect } from "react";
import { ChatContext } from "../../Provider";
import PopUpModal from "../../../Modals/PopUp/PopUp";

import { useDrawing } from "../../../../hooks/useDrawing";
import { useWidth } from "../../../../hooks/useWidth";

// Components
import BtnSpinner from "../../../Buttons/BtnClick/BtnClick";

const CreateDrawing = () => {
  const {
    modalCanvas,
    setModalCanvas,
    messagesColor,
    messagesText,
    isCanvasAnimations,
    setRestartCoordenates,
    setIsDrawingFinished,
    setIsCanvasNeedToClear,
    setMessagesText,
    setSecondsDrawing,
    setIsCanvasAnimations,
    setImgState,
    setImgStateUrl
  } = useContext(ChatContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasAnimations = useRef<HTMLCanvasElement | null>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(500);
  const [backgroundColor, setBackgroundColor] = useState<string>("#a2aebe");
  const [pencilColor, setPenciColor] = useState<string>("#ffffff");
  const [lineWidth, setLineWidth] = useState<number>(3);

  useDrawing(canvasRef.current, pencilColor, lineWidth);
  useWidth(setWidthCanvas, "75%", 500);

  useEffect(() => {
    if (isCanvasAnimations) {
      // Nothing
    } else {
      // DELETE CANVAS CONTENT
      if (canvasAnimations.current && canvasRef.current) {
        var ctx = canvasAnimations.current.getContext("2d"); // Canvas of Vectors
        var ctx_2 = canvasRef.current.getContext("2d"); // Canvas of green line
        if (ctx && ctx_2) {
          ctx.clearRect(
            0,
            0,
            canvasAnimations.current.width,
            canvasAnimations.current.height
          );
          ctx_2.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }
    }
  }, [isCanvasAnimations]);

  const clean = () => {
    if (setRestartCoordenates) setRestartCoordenates(true);
    if (setIsDrawingFinished) setIsDrawingFinished(false);
    if (setIsCanvasNeedToClear) setIsCanvasNeedToClear(true);
    if (setMessagesText) setMessagesText("");
    if (setSecondsDrawing) setSecondsDrawing(0);
    if (setIsCanvasAnimations) setIsCanvasAnimations(false);
    if (setModalCanvas) setModalCanvas(false);
  };

  const urlToObject = async (imageUrl: string): Promise<File | null> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    var file: File | null = null;
    file = new File([blob], "canvas-drawing.png", { type: "image/png" });

    return file;
  };

  return (
    <PopUpModal
      extraCss={styles.canvas_card}
      isModal={modalCanvas}
      setIsModal={setModalCanvas}
      callbackClose={clean}
    >
      <div className={styles.canvas_title}>Create a drawing</div>
      <div className={styles.controllers}>
        <div className={styles.colors}>
          <div>Canvas color:</div>
          <input
            onChange={e => {
              setBackgroundColor(e.target.value);
            }}
            value={backgroundColor}
            type="color"
            name="Canvas color"
            id="color-canvas"
          />
        </div>
        <div className={styles.colors}>
          <div>Pencil color:</div>
          <input
            onChange={e => {
              setPenciColor(e.target.value);
            }}
            value={pencilColor}
            type="color"
            name="Pencil color"
            id="color-pencil"
          />
        </div>
        <div className={styles.lineWidth}>
          <div>Pencil width</div>
          <input
            min="1"
            max="15"
            type="range"
            name="Line width"
            id="canvas-pencil-width"
            value={lineWidth}
            onChange={e => {
              setLineWidth(parseInt(e.target.value));
            }}
          />
        </div>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
        className={styles.canvas_container}
      >
        <div className={styles.canvas_container_relative}>
          <canvas
            ref={canvasRef}
            width={widthCanvas}
            height="350"
            className={styles.canvas}
            style={{
              backgroundColor
            }}
          ></canvas>
        </div>
        <div className={styles.canvas_container_messages}>{messagesText}</div>
        <div className={styles.buttons}>
          <BtnSpinner
            text="Clear canvas"
            callback={() => {
              if (setRestartCoordenates) setRestartCoordenates(true);
              if (setIsDrawingFinished) setIsDrawingFinished(false);
              if (setIsCanvasNeedToClear) setIsCanvasNeedToClear(true);
              if (setMessagesText) setMessagesText("");
              if (setSecondsDrawing) setSecondsDrawing(0);
              if (setIsCanvasAnimations) setIsCanvasAnimations(false);
            }}
            color="gray"
            border="round_5"
            additionalClass="btn-canvas"
          />
          <BtnSpinner
            text="Save drawing"
            callback={async () => {
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
                const img = canvasRef.current.toDataURL("image/png");
                var file: any = await urlToObject(img);
                if (setImgState && setImgStateUrl && file) {
                  setImgState(file);
                  setImgStateUrl(img);
                  clean();
                }
              }
            }}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-canvas"
            role="submit"
          />
        </div>
      </form>
    </PopUpModal>
  );
};
export default CreateDrawing;
