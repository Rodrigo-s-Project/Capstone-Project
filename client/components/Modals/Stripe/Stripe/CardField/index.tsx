import styles from "./card.module.scss";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_OPTIONS: any = {
  iconStyle: "solid",
  style: {
    base: {
      "::placeholder": {
        color: "#748094" // --gray-300
      }
    }
  }
};

export default function CardField({ onChange }: { onChange: (e: any) => any }) {
  return (
    <div className={styles.formRow}>
      <CardElement
        options={CARD_OPTIONS}
        className={styles.card}
        onChange={onChange}
      />
    </div>
  );
}
