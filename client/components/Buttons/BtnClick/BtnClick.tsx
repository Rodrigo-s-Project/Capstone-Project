import styles from "../Btn.module.scss";

// Loader
import Spinner from "../../Loader/Spinner/Spinner";

type Props = {
  text: string;
  callback: () => any;
  color: "lavender-300" | "lavender-200" | "gray";
  border: "complete_rounded" | "round_5";
  additionalClass?: string;
  isLoading?: boolean;
};

const BtnClick = ({
  text,
  callback,
  color,
  border,
  additionalClass = "",
  isLoading
}: Props) => {
  const getColorLoader = ():
    | "lavender-300"
    | "lavender-200"
    | "primary"
    | "dark" => {
    if (color == "lavender-200" || color == "lavender-300") return "primary";
    return "dark";
  };

  return (
    <button
      extra-css={additionalClass}
      onClick={() => {
        if (!isLoading) {
          callback();
        }
      }}
      className={`${styles.btn} ${styles[color]} ${styles[border]}`}
    >
      {!isLoading && text}
      {isLoading && (
        <Spinner additionalClass="spinner-btn" color={getColorLoader()} />
      )}
    </button>
  );
};

export default BtnClick;
