import PopUpModal from "../PopUp/PopUp";
import Stripe from "./Stripe/index";
import { useState, useContext } from "react";
import styles from "./Stripe.module.scss";
import InputText from "../../Input/Text/InputText";
import { PaymentMethod } from "@stripe/stripe-js";
// Routes
import {
  BODY_CREATE_COMPANY,
  createCompanyEndpoint
} from "../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../routes/index.routes";
import axios from "axios";

import { GlobalContext } from "../../../pages/_app";

export type STRIPE_PRODUCT = {
  name: string;
  price: number;
  productBy: string;
};

export const BASIC_STRIPE = {
  name: "Basic",
  price: 200,
  productBy: "Teamplace"
};

export const ENTERPRISE_STRIPE = {
  name: "Enterprise",
  price: 1200,
  productBy: "Teamplace"
};

const StripeModal = () => {
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [selectedProductStripe, setSelectedProductStripe] = useState<
    STRIPE_PRODUCT
  >(BASIC_STRIPE);
  const {
    modalPopUpStripe,
    setModalPopUpStripe,
    refetchUser,
    setRefetchCompanies,
    setArrayMsgs
  } = useContext(GlobalContext);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [name, setName] = useState("");

  const createACompanyFetch = async (_: PaymentMethod) => {
    try {
      setIsLoadingCreate(true);
      
      const body: BODY_CREATE_COMPANY = {
        name,
        type: selectedProductStripe.name
      };

      const response = await axios.post(createCompanyEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoadingCreate(false);

      const data: RESPONSE = response.data;

      if (!data.isAuth) {
        // Bad
        if (refetchUser) refetchUser();
        return;
      }

      if (data.data) {
        // Clean modal
        if (setModalPopUpStripe) setModalPopUpStripe(false);

        // Refetch
        if (setRefetchCompanies) {
          setRefetchCompanies(prev => !prev);
        }
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }

      if (data.typeMsg == "success") clean();
    } catch (error) {
      console.error(error);
      setIsLoadingCreate(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
    }
  };

  const clean = () => {
    // Clean state
    setName("");
    setSelectedProductStripe(BASIC_STRIPE);
    setIsLoadingStripe(false);
  };

  return (
    <PopUpModal
      extraCss={styles.card}
      extraCssContainer={styles.card_container}
      isModal={modalPopUpStripe}
      setIsModal={setModalPopUpStripe}
      callbackClose={clean}
    >
      <div className={styles.selectType}>
        <h2>Type of company</h2>
        <div className={styles.selectType_info}>
          <div
            className={`${
              styles.selectType_info_type
            } ${selectedProductStripe.name == "Basic" &&
              styles.selectType_info_type_selected}`}
            onClick={() => {
              setSelectedProductStripe(BASIC_STRIPE);
            }}
          >
            <h3>Basic:</h3>
            <ul>
              <li>Limited storage of 1TB.</li>
              <li>Up to 15 employees and 15 clients</li>
              <li>You can always buy more GB of storage</li>
            </ul>
          </div>
          <div
            className={`${
              styles.selectType_info_type
            } ${selectedProductStripe.name == "Enterprise" &&
              styles.selectType_info_type_selected}`}
            onClick={() => {
              setSelectedProductStripe(ENTERPRISE_STRIPE);
            }}
          >
            <h3>Enterprise:</h3>
            <ul>
              <li>Limited storage of 100TB.</li>
              <li>No limit on users.</li>
              <li>You can always buy more GB of storage</li>
            </ul>
          </div>
          <div className={styles.input}>
            <InputText
              text="Company name"
              value={name}
              setValue={setName}
              id="input-code-create-company-stripe"
              type="text"
            />
          </div>
        </div>
      </div>
      <div className={styles.stripe}>
        <h2 className={styles.h2}>Make payment</h2>
        {modalPopUpStripe && (
          <Stripe
            product={selectedProductStripe}
            isLoading={isLoadingStripe || isLoadingCreate}
            setIsLoading={setIsLoadingStripe}
            makePayment={token => {
              createACompanyFetch(token);
            }}
          />
        )}
      </div>
    </PopUpModal>
  );
};

export default StripeModal;
// billing_details:
//   address:
//     city: null
//     country: null
//     line1: null
//     line2: null
//     postal_code: "42424"
//     state: null
//     [[Prototype]]: Object
//   email: "r@gmail.com"
//   name: "Rodrigo Teran"
//   phone: "6505758192"
//   [[Prototype]]: Object
// card:
//   brand: "visa"
// checks:
//   address_line1_check: null
//   address_postal_code_check: null
//   cvc_check: null
//   [[Prototype]]: Object
// country: "US"
// exp_month: 4
// exp_year: 2024
// funding: "credit"
// generated_from: null
// last4: "4242"
// networks: {available: Array(1), preferred: null}
// three_d_secure_usage: {supported: true}
// wallet: null
// [[Prototype]]: Object
// created: 1659030119
// customer: null
// id: "pm_1LQaigHELPGPXYgjfTVBszzZ"
// livemode: false
// object: "payment_method"
// type: "card"
