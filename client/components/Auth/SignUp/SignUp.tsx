import { useState } from "react";
import styles from "./SignUp.module.scss";
import axios from "axios";

// Componnets
import SignUpCard from "./SignUpCard/SignUpCard";
import Info from "./Info/Info";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async () => {
    console.log("sign up...");
    const response = await axios.post("http://localhost:2000/auth/sign-up", {
      username,
      email,
      password,
      confirmPassword
    });

    console.log(response);
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
      />
    </div>
  );
};

export default SignUp;
