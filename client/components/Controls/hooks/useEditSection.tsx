import { useCallback, useContext, Dispatch, SetStateAction } from "react";
import {
  editControlEndpoint,
  BODY_EDIT_SECTION,
  DATA_EDIT_SECTION
} from "../../../routes/dashboard.controls.routes";
import { RESPONSE } from "../../../routes/index.routes";
import axios from "axios";
import { GlobalContext } from "../../../pages/_app";
import { useRouter } from "next/router";

export const useEditSection = () => {
  const { setArrayMsgs } = useContext(GlobalContext);
  const router = useRouter();
  const { id } = router.query;

  const fetchEdit = useCallback(
    async (
      {
        typeEdit,
        identifier,
        teamId,
        companyId,
        updatedValue,
        isUpdateOnSingleModel
      }: BODY_EDIT_SECTION,
      setIsLoading: Dispatch<SetStateAction<boolean>>,
      callback: (data: DATA_EDIT_SECTION) => any
    ) => {
      try {
        // Do fetch
        const body: BODY_EDIT_SECTION = {
          typeEdit,
          identifier,
          teamId,
          companyId,
          updatedValue,
          isUpdateOnSingleModel
        };

        setIsLoading(true);
        const response = await axios.put(editControlEndpoint.url(id), body, {
          withCredentials: true
        });
        setIsLoading(false);

        const data: RESPONSE = response.data;
        const endpointData: DATA_EDIT_SECTION = data.data;

        if (!endpointData) {
          router.replace("/");
          return;
        }

        if (!endpointData.newModel) {
          router.replace("/");
          return;
        }

        if (callback) callback(endpointData);
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
        router.replace("/");
      }
    },
    [setArrayMsgs, id, router]
  );

  return {
    fetchEdit
  };
};
