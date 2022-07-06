import { useState, useContext } from "react";
import styles from "./SignUp.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

// Contexts
import { GlobalContext } from "../../../pages/_app";

// Routes
import { RESPONSE } from "../../../routes/index.routes";
import { BODY_SIGN_UP, signUpEndpoint } from "../../../routes/auth.routes";

// Componnets
import SignUpCard from "./SignUpCard/SignUpCard";
import Info from "./Info/Info";

const SignUp = () => {
  const router = useRouter();

  const { setArrayMsgs } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    try {
      setIsLoading(true);
      const body: BODY_SIGN_UP = {
        username,
        email,
        password,
        confirmPassword
      };
      const response = await axios.post(signUpEndpoint.url, body);
      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (data.isAuth) {
        // Good
        router.replace("/log-in");
      } else {
        if (setArrayMsgs && data.readMsg)
          setArrayMsgs(prev => [
            {
              type: data.typeMsg,
              text: data.message
            },
            ...prev
          ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: error.message
          },
          ...prev
        ]);
    }
  };

  return (
    <div className={styles.signup}>
      <Info />
      <SignUpCard
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        signUp={signUp}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SignUp;
