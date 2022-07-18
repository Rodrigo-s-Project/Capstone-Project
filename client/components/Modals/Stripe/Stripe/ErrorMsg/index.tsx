import styles from "./error.module.scss";
import ErrorStripeIcon from "../../../../Svgs/StripeError";

export default function ErrorMsg({ children }: { children: any }) {
  return (
    <div className={styles.error}>
      <ErrorStripeIcon
        className={styles.svg}
        xColor="#FFF"
        circleColor="#fc5858"
      />
      {children}
    </div>
  );
}
