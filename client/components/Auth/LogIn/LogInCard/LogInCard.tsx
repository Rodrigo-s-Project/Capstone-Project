import { Dispatch, SetStateAction } from "react";
import styles from "./LogInCard.module.scss";

// Componnets
import Card from "../../../Card/Card";
import InputText from "../../../Input/Text/InputText";
import BtnClick from "../../../Buttons/BtnClick/BtnClick";
import BtnLink from "../../../Buttons/BtnLink/BtnLink";

type Props = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  logIn: () => any;
};

const LogInCard = ({
  email,
  setEmail,
  password,
  setPassword,
  logIn
}: Props) => {
  return (
    <section className={styles.card_login}>
      <Card>
        <h1>Log In</h1>
        <div className={styles.card_login_inputs}>
          <InputText
            text="Email"
            value={email}
            setValue={setEmail}
            id="#email-log-in"
            type="text"
          />
          <InputText
            text="Password"
            value={password}
            setValue={setPassword}
            id="#password-log-in"
            type="password"
          />
        </div>
        <div>
          <BtnClick
            text="Enter"
            callback={logIn}
            color="lavender-300"
            border="round_5"
            additionalClass="btn-enter-login"
          />
        </div>
        <div className={styles.card_login_or}>
          <div className={styles.card_login_or_line}></div>
          <div className={styles.card_login_or_letter}>O</div>
          <div className={styles.card_login_or_line}></div>
        </div>
        <div>
          <BtnLink
            text="Create Account"
            url="/sign-up"
            color="lavender-300"
            border="round_5"
            additionalClass="btn-enter-signup"
          />
        </div>
      </Card>
    </section>
  );
};

export default LogInCard;
