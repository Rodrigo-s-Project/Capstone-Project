import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Componnets
import LogInCard from "./LogInCard/LogInCard";

const LogIn = () => {
  // Router
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const logIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put("http://localhost:2000/auth/log-in", {
        email,
        password
      });
      setIsLoading(false);
      const data = response.data;
      if (data.isAuth) {
        // Good
        // TODO: create dashboard page
        router.replace("/dashboard");
      } else {
        // TODO: not success :/
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <LogInCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        logIn={logIn}
        isLoading={isLoading}
      />
    </>
  );
};

export default LogIn;
