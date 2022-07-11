import styles from "../Btn.module.scss";

// Loader
import Spinner from "../../Loader/Spinner/Spinner";

type Props = {
  text: string;
  callback?: () => any;
  color: "lavender-300" | "lavender-200" | "gray" | "danger";
  border: "complete_rounded" | "round_5";
  additionalClass?: string;
  isLoading?: boolean;
  isDiv?: boolean;
};

const BtnClick = ({
  text,
  callback,
  color,
  border,
  additionalClass = "",
  isLoading,
  isDiv = false
}: Props) => {
  const getColorLoader = ():
    | "lavender-300"
    | "lavender-200"
    | "primary"
    | "dark" => {
    if (color == "lavender-200" || color == "lavender-300" || color == "danger")
      return "primary";
    return "dark";
  };

  return (
    <>
      {isDiv && (
        <div
          extra-css={additionalClass}
          className={`${styles.btn} ${styles[color]} ${styles[border]}`}
          tabIndex={-1}
        >
          {!isLoading && text}
          {isLoading && (
            <Spinner additionalClass="spinner-btn" color={getColorLoader()} />
          )}
        </div>
      )}
      {!isDiv && (
        <button
          extra-css={additionalClass}
          onClick={() => {
            if (!isLoading && callback) {
              callback();
            }
          }}
          className={`${styles.btn} ${styles[color]} ${styles[border]}`}
          tabIndex={-1}
        >
          {!isLoading && text}
          {isLoading && (
            <Spinner additionalClass="spinner-btn" color={getColorLoader()} />
          )}
        </button>
      )}
    </>
  );
};

export default BtnClick;
