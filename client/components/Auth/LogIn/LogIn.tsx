import { useState } from "react";

// Componnets
import LogInCard from "./LogInCard/LogInCard";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {};

  return (
    <>
      <LogInCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        logIn={logIn}
      />
    </>
  );
};

export default LogIn;
