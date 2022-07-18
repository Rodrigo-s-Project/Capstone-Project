import { StripeError } from "@stripe/stripe-js";
import { Dispatch, SetStateAction } from "react";
import styles from "./terms.module.scss";
import CheckIcon from "../../../../Svgs/Check";

type Props = {
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  isChecked: boolean;
  setError: Dispatch<
    SetStateAction<
      | StripeError
      | {
          message: string;
        }
      | null
    >
  >;
};

export default function TermsAndConditions({
  setIsChecked,
  setError,
  isChecked
}: Props) {
  return (
    <div className={styles.div}>
      <div
        className={`${styles.input} ${isChecked && styles.input_checked}`}
        onClick={() => {
          setError(null);
          setIsChecked(prev => !prev);
        }}
      >
        {isChecked && <CheckIcon />}
      </div>
      <div className={styles.label}>I accept the terms and conditions</div>
    </div>
  );
}
