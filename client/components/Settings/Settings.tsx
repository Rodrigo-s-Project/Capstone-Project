import styles from "./Settings.module.scss";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../pages/_app";
import { SettingsContext } from "./Provider";
import { Element, Group } from "../Profile/Profile";
import codes from "iso-language-codes";

const Settings = () => {
  const { setSelectedCompany, setSelectedTeam } = useContext(GlobalContext);
  const { setModalPopUpLang } = useContext(SettingsContext);

  useEffect(() => {
    if (setSelectedCompany) setSelectedCompany(undefined);
    if (setSelectedTeam) setSelectedTeam(undefined);
  }, [setSelectedTeam, setSelectedCompany]);

  const editLang = () => {
    if (setModalPopUpLang) setModalPopUpLang(true);
  };

  const getNameLang = (language: string) => {
    const index = codes.findIndex(code => {
      return code.iso639_1 == language;
    });

    return codes[index] ? codes[index].name : language;
  };

  const getLangPref = () => {
    const lang: string | null = localStorage.getItem("lang");
    if (lang) return getNameLang(lang);

    const windowEl: any = window;
    let language: any =
      windowEl.navigator.userLanguage || windowEl.navigator.language;

    return getNameLang(language);
  };

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <div className={styles.settings_container}>
        <Group title="Preferences">
          <Element
            title="Language preference:"
            value={getLangPref()}
            callback={editLang}
          />
        </Group>
      </div>
    </div>
  );
};

export default Settings;
