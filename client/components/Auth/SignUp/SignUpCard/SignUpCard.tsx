import { Dispatch, SetStateAction } from "react";
import styles from "./SignUpCard.module.scss";

// Componnets
import Card from "../../../Card/Card";
import InputText from "../../../Input/Text/InputText";
import BtnClick from "../../../Buttons/BtnClick/BtnClick";

type Props = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  signUp: () => any;
  isLoading: boolean;
};

const SignUpCard = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  signUp,
  isLoading
}: Props) => {
  return (
    <section className={styles.card_signup}>
      <Card>
        <h1>Sign Up</h1>
        <div className={styles.card_signup_inputs}>
          <InputText
            text="Username"
            value={username}
            setValue={setUsername}
            id="#username-sign-up"
            type="text"
          />
          <InputText
            text="Email"
            value={email}
            setValue={setEmail}
            id="#email-sign-up"
            type="text"
          />
          <InputText
            text="Password"
            value={password}
            setValue={setPassword}
            id="#password-sign-up"
            type="password"
          />
          <InputText
            text="Confirm password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            id="#confirm-password-sign-up"
            type="password"
          />
        </div>
        <div>
          <BtnClick
            text="Create account"
            callback={signUp}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-create-signup"
            isLoading={isLoading}
          />
        </div>
      </Card>
    </section>
  );
};

export default SignUpCard;
