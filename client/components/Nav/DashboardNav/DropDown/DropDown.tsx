import styles from "./DropDown.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useContext } from "react";

// Routes
import { logOutEndpoint } from "../../../../routes/auth.routes";
import { RESPONSE } from "../../../../routes/index.routes";

// Contexts
import { GlobalContext } from "../../../../pages/_app";

// Loader
import Loader from "../../../Loader/Spinner/Spinner";

type Props = {
  isOpen: boolean;
};

const DropDown = ({ isOpen }: Props) => {
  // Router
  const router = useRouter();

  const { setArrayMsgs, refetchUser } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);

  const successLogOut = (dataCallback: RESPONSE) => {
    // Go to main page
    if (!dataCallback.isAuth) router.replace("/");
  };

  const logOut = async () => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      };

      const response = await axios.put(logOutEndpoint.url, {}, config);
      setIsLoading(false);

      const data: RESPONSE = response.data;

      // Good
      if (refetchUser) refetchUser(successLogOut);

      if (setArrayMsgs && data.readMsg) {
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
    <div className={`${styles.drop} ${isOpen && styles.drop_open}`}>
      <div
        title="Log out"
        onClick={() => {
          if (!isLoading) logOut();
        }}
        className={styles.drop_link}
      >
        {isLoading && <Loader color="lavender-200" />}
        {!isLoading && "Log Out"}
      </div>
      <div className={styles.drop_link} title="Go to profile">
        Go to Profile
      </div>
    </div>
  );
};

export default DropDown;
