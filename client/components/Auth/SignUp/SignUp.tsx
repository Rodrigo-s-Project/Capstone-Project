import { useState } from "react";
import styles from "./SignUp.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

// Componnets
import SignUpCard from "./SignUpCard/SignUpCard";
import Info from "./Info/Info";

const SignUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:2000/auth/sign-up", {
        username,
        email,
        password,
        confirmPassword
      });
      setIsLoading(false);
      const data = response.data;
      if (data.isAuth) {
        // Good
        router.replace("/log-in");
      } else {
        // TODO: not success :/
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
