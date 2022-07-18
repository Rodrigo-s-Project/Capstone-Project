import styles from "./stripe.module.scss";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { ProductPayment } from "./stripe.types";

import {
  loadStripe,
  PaymentMethod,
  PaymentMethodResult,
  StripeError
} from "@stripe/stripe-js";
import {
  Elements,
  useElements,
  useStripe,
  CardElement
} from "@stripe/react-stripe-js";

// Components
import CardField from "./CardField/index";
import Field from "./Field/index";
import SubmitBtn from "./SubmitBtn/index";
import ErrorMsg from "./ErrorMsg/index";
import TermsAndConditions from "./TermsAndConditions/index";

type BillingDetails = {
  email: string;
  phone: string;
  name: string;
};

type PropsStripe = {
  makePayment: (token: PaymentMethod) => any;
  product: ProductPayment;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const stripePromise = loadStripe(process.env.STRIPE_KEY || "");

function StripeCheckout({
  makePayment,
  product,
  isLoading: processing,
  setIsLoading: setProcessing
}: PropsStripe) {
  const stripe = useStripe();
  const elements = useElements();

  // State
  const [error, setError] = useState<StripeError | { message: string } | null>(
    null
  );
  const [cardComplete, setCardComplete] = useState(false);
  const [isTerms, setIsTerms] = useState(false);

  // Detallles
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    email: "",
    phone: "",
    name: ""
  });

  // Submit
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // No ha cargadi
      return;
    }
    if (error) return;
    if (!isTerms) {
      setError({
        message: "You need to accept the terms and conditions."
      });
      return;
    }
    if (cardComplete) setProcessing(true);

    const payload: PaymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement) as any,
      billing_details: billingDetails
    });

    setProcessing(false);

    if (payload.error) {
      setError(payload.error);
    } else {
      if (payload.paymentMethod) makePayment(payload.paymentMethod);
    }
  };

  return (
    <form action="Form" onSubmit={handleSubmit}>
      <fieldset className={styles.form_group}>
        <Field
          label="Name"
          id="name-stripe"
          type="text"
          placeholder="Complete name"
          required
          autoComplete="name"
          value={billingDetails.name}
          onChange={(e: any) => {
            setBillingDetails({
              ...billingDetails,
              name: e.target.value
            });
          }}
        />
        <Field
          label="Email"
          id="email-stripe"
          type="email"
          placeholder="example@gmail.com"
          required
          autoComplete="email"
          value={billingDetails.email}
          onChange={(e: any) => {
            setBillingDetails({
              ...billingDetails,
              email: e.target.value
            });
          }}
        />
        <Field
          label="Telephone number"
          id="tel-stripe"
          type="tel"
          placeholder="(444) 444-4444"
          required
          autoComplete="tel"
          value={billingDetails.phone}
          onChange={(e: any) => {
            setBillingDetails({
              ...billingDetails,
              phone: e.target.value
            });
          }}
        />
      </fieldset>
      <fieldset className="FormGroup">
        <CardField
          onChange={e => {
            setError(e.error);
            setCardComplete(e.complete);
          }}
        />
      </fieldset>
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
      <TermsAndConditions
        isChecked={isTerms}
        setIsChecked={setIsTerms}
        setError={setError}
      />
      <SubmitBtn processing={processing} error={error}>
        Pay ${product.price}
      </SubmitBtn>
    </form>
  );
}

export default function Stripe({
  makePayment,
  product,
  isLoading,
  setIsLoading
}: PropsStripe) {
  return (
    <div className={styles.stripe}>
      <Elements stripe={stripePromise}>
        <StripeCheckout
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          makePayment={makePayment}
          product={product}
        />
      </Elements>
    </div>
  );
}
