import { useContext, useState } from "react";
import { GlobalContext } from "../pages/_app";
import axios from "axios";

interface UseTranslate {
  (): {
    translate: (
      fromLang: string,
      toLang: string,
      text: string
    ) => Promise<string | undefined>;
    isLoading: boolean;
  };
}

export const useTranslate: UseTranslate = () => {
  const { setArrayMsgs } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const translate = async (fromLang: string, toLang: string, text: string) => {
    try {
      let url: string = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
      url += "&q=" + encodeURI(text);
      url += `&source=${fromLang}`;
      url += `&target=${toLang}`;

      setIsLoading(true);

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });
      setIsLoading(false);

      const data: any = response.data.data;

      if (!data) return text;
      if (!data.translations) return text;
      if (!data.translations[0]) return text;
      if (!data.translations[0].translatedText) return text;

      return data.translations[0].translatedText;
    } catch (error) {
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: `Error while translating, ${error}`
          },
          ...prev
        ]);
        // Remain with original text
        return text;
      }
    }
  };

  return {
    translate,
    isLoading
  };
};
