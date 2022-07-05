import { useState } from "react";

// Componnets
import LogInCard from "./LogInCard/LogInCard";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logIn = () => {};

  return (
    <>
      <LogInCard
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        logIn={logIn}
      />
    </>
  );
};

export default LogIn;
