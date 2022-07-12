import styles from "../Btn.module.scss";

// Loader
import Spinner from "../../Loader/Spinner/Spinner";

type Props = {
  children: any;
  callback: () => any;
  color: "lavender-300" | "lavender-200" | "gray" | "danger";
  border: "complete_rounded" | "round_5";
  additionalClass?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  title?: string;
};

const BtnChildren = ({
  children,
  callback,
  color,
  border,
  additionalClass = "",
  isLoading,
  isDisabled = false,
  title
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
      title={title}
      className={`${styles.btn} ${styles[color]} ${
        styles[border]
      } ${isDisabled && styles.disabled}`}
      tabIndex={-1}
    >
      {!isLoading && children}
      {isLoading && (
        <Spinner additionalClass="spinner-btn" color={getColorLoader()} />
      )}
    </button>
  );
};

export default BtnChildren;
