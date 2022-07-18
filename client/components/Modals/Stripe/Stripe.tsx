import PopUpModal from "../PopUp/PopUp";
import Stripe from "./Stripe/index";
import { useState, useContext } from "react";
import styles from "./Stripe.module.scss";

import { GlobalContext } from "../../../pages/_app";

const StripeModal = () => {
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const { modalPopUpStripe, setModalPopUpStripe } = useContext(GlobalContext);

  return (
    <PopUpModal extraCss={styles.card} isModal={modalPopUpStripe} setIsModal={setModalPopUpStripe}>
      <h2 className={styles.h2}>Make payment</h2>
      <Stripe
        product={{
          name: "Basic",
          price: 100,
          productBy: "Teamplace"
        }}
        isLoading={isLoadingStripe}
        setIsLoading={setIsLoadingStripe}
        makePayment={token => {}}
      />
    </PopUpModal>
  );
};

export default StripeModal;
