import { useState } from "react";
import styles from "./SignUp.module.scss";

// Componnets
import SignUpCard from "./SignUpCard/SignUpCard";
import Info from "./Info/Info";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = () => {};

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
