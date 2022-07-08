import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Routes
import { DATA_GET_USER, getUser } from "../routes/main.routes";
import { RESPONSE } from "../routes/index.routes";

// Config
import {
  protectedRoutes,
  nonAuthRestrictedRoutes
} from "../config/protectedRoutes";

type Params = {
  setUser: Dispatch<SetStateAction<DATA_GET_USER | undefined>>;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  checkIfNeedToUpdateColor: (userData: DATA_GET_USER) => any;
};

export const useAuth = ({
  setUser,
  setIsAuth,
  checkIfNeedToUpdateColor
}: Params) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (_callback?: any) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    };

    setIsLoading(true);
    const response = await axios.get(getUser.url, config);
    setIsLoading(false);

    const data: RESPONSE = response.data;
    const userData: DATA_GET_USER = data.data;

    redirectInCaseOfProtectedRoute(data.isAuth);

    if (setIsAuth) setIsAuth(data.isAuth);

    // Only if yes auth
    if (setUser && data.isAuth) setUser(userData);
    if (_callback) _callback(data);
    if (data.isAuth) checkIfNeedToUpdateColor(userData);
  };

  const redirectInCaseOfProtectedRoute = (isAuth: boolean) => {
    if (!isAuth) {
      // Redirect in case of no Auth
      for (let i = 0; i < protectedRoutes.length; i++) {
        if (router.pathname.includes(protectedRoutes[i])) {
          router.replace("/");
          return;
        }
      }
    } else {
      // Redirect in case of Auth
      for (let i = 0; i < nonAuthRestrictedRoutes.length; i++) {
        if (nonAuthRestrictedRoutes[i] == router.pathname) {
          router.replace("/dashboard");
          return;
        }
      }
    }
  };

  return {
    refetch: fetchUser,
    isLoading
  };
};
