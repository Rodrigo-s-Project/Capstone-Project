import { useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Contexts
import { GlobalContext } from "../../../pages/_app";

// Routes
import { logInEndpoint, BODY_LOG_IN } from "../../../routes/auth.routes";
import { RESPONSE } from "../../../routes/index.routes";

// Componnets
import LogInCard from "./LogInCard/LogInCard";

const LogIn = () => {
  // Router
  const router = useRouter();

  const { setArrayMsgs, refetchUser } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const successLogIn = (dataCallback: RESPONSE) => {
    // Go to dashboard
    if (dataCallback.isAuth) router.replace("/dashboard");
  };

  const logIn = async () => {
    try {
      setIsLoading(true);
      const body: BODY_LOG_IN = {
        email,
        password
      };
      const response = await axios.put(logInEndpoint.url, body, {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      if (data.isAuth) {
        // Good
        if (refetchUser) refetchUser(successLogIn);
      } else if (setArrayMsgs && data.readMsg) {
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

  return (
    <LogInCard
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      logIn={logIn}
      isLoading={isLoading}
    />
  );
};

export default LogIn;
