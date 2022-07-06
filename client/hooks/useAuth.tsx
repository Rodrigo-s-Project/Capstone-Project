import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Routes
import { DATA_GET_USER, getUser } from "../routes/main.routes";
import { RESPONSE } from "../routes/index.routes";

// Config
import { protectedRoutes } from "../config/protectedRoutes";

type Params = {
  setUser: Dispatch<SetStateAction<DATA_GET_USER | undefined>>;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
};

export const useAuth = ({ setUser, setIsAuth }: Params) => {
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
    console.log(response);
    setIsLoading(false);

    const data: RESPONSE = response.data;
    const userData: DATA_GET_USER = data.data;

    redirectInCaseOfProtectedRoute(data.isAuth);

    if (setIsAuth) setIsAuth(data.isAuth);

    // Only if yes auth
    if (setUser && data.isAuth) setUser(userData);
    if (_callback) _callback(data);
  };

  const redirectInCaseOfProtectedRoute = (isAuth: boolean) => {
    if (!isAuth) {
      for (let i = 0; i < protectedRoutes.length; i++) {
        if (protectedRoutes[i] == router.pathname) {
          router.replace("/");
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
