import styles from "./Message.module.scss";
import { MESSAGE } from "../../messages.types";
import { GlobalContext } from "../../../../pages/_app";
import { ChatContext } from "../../Provider";
import { useContext, CSSProperties, useState } from "react";
import { getImage } from "../../../../routes/cdn.routes";
import { useTranslate } from "../../../../hooks/useTranslate";

// Icons
import CameraIcon from "../../../Svgs/Camera";

import UsersReadComponent, {
  USER_READ
} from "../../../Reading/Users/UsersRead";

type Props = {
  message: MESSAGE;
};

const Message = ({ message }: Props) => {
  const { user, setArrayMsgs } = useContext(GlobalContext);
  const { selectedConnection } = useContext(ChatContext);
  const { translate, isLoading: isLoadingTranslate } = useTranslate();
  const [msgText, setMsgText] = useState(message.message.text);
  const [msgTextTrans, setMsgTextTrans] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);

  if (message.message.text.trim() == "") return null;

  const getOwner = (): any => {
    if (selectedConnection) {
      for (let i = 0; i < selectedConnection.users.length; i++) {
        if (selectedConnection.users[i].user.id == message.message.ownerId) {
          return selectedConnection.users[i];
        }
      }
      return undefined;
    }
    return undefined;
  };

  const getFormatUserRead = (): Array<USER_READ> => {
    let aux: Array<USER_READ> = [];

    for (let i = 0; i < message.users.length; i++) {
      aux.push({
        username: message.users[i].team.User_Team.username,
        userData: {
          email: message.users[i].user.email,
          globalUsername: message.users[i].user.globalUsername,
          id: message.users[i].user.id,
          isDarkModeOn: message.users[i].user.isDarkModeOn,
          profilePictureURL: message.users[i].user.profilePictureURL,
          status: message.users[i].user.status,
          User_Read_Files: {
            createdAt: message.users[i].createdAt || new Date()
          }
        }
      });
    }

    return aux;
  };

  const getLangPref = () => {
    const lang: string | null = localStorage.getItem("lang");
    if (lang) return lang;

    const windowEl: any = window;
    let language: any =
      windowEl.navigator.userLanguage || windowEl.navigator.language;

    return language.substring(0, language.indexOf("-")) != ""
      ? language.substring(0, language.indexOf("-"))
      : language;
  };

  const translateThisMessage = async () => {
    let language: any = getLangPref();

    const fromLang: string = message.message.language
      ? message.message.language.substring(
          0,
          message.message.language.indexOf("-")
        ) != ""
        ? message.message.language.substring(
            0,
            message.message.language.indexOf("-")
          )
        : message.message.language
      : language;

    if (fromLang == language) {
      if (setArrayMsgs) {
        setArrayMsgs(prev => [
          {
            type: "info",
            text: "Same language"
          },
          ...prev
        ]);
      }
      return;
    }

    const transText: string | undefined = await translate(
      fromLang,
      language,
      message.message.text
    );

    if (!transText) return;

    setIsTranslated(transText != message.message.text);
    setMsgText(transText);
    setMsgTextTrans(transText);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.chat} ${
          user && user.id == message.message.ownerId
            ? styles.chat_owner
            : styles.chat_foreign
        }`}
      >
        <div className={styles.chat_text}>
          {message.message.mediaURL && (
            <div className={styles.chat_img}>
              <img
                src={`${getImage.url(message.message.mediaURL)}`}
                alt="Picture"
              />
            </div>
          )}

          {message.message.lat && message.message.lng && (
            <div
              title="Open on Google Maps"
              onClick={() => {
                window.open(
                  `http://maps.google.com/maps?z=15&t=m&q=loc:${message.message.lat}+${message.message.lng}`,
                  "_blank"
                );
              }}
              className={styles.maps}
            >
              <img src="/maps/Google_Maps_Logo_2020.png" alt="Google Maps" />
            </div>
          )}
          {user && user.id != message.message.ownerId && (
            <div className={`${styles.translate}`}>
              <button
                onClick={() => {
                  if (isTranslated) {
                    setMsgText(message.message.text);
                    setIsTranslated(false);
                  } else {
                    if (msgTextTrans == "") {
                      translateThisMessage();
                    } else {
                      setMsgText(msgTextTrans);
                      setIsTranslated(true);
                    }
                  }
                }}
              >
                {isTranslated ? "Original msg" : "Translate"}
              </button>
              <div className={`${styles.translate_dots}`}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          <div className={styles.chat_text_msg}>
            {isLoadingTranslate ? "Loading..." : msgText}
          </div>
        </div>
        <div
          className={`${styles.chat_reading}`}
          style={
            {
              "--length-container":
                getFormatUserRead().length > 5 ? 5 : getFormatUserRead().length
            } as CSSProperties
          }
        >
          <UsersReadComponent usersRead={getFormatUserRead()} />
        </div>
      </div>
      <div
        className={`${styles.user} ${user &&
          user.id == message.message.ownerId &&
          styles.user_reverse}`}
      >
        <div className={styles.user_profile}>
          <div className={styles.user_profile_camera}>
            <CameraIcon />
          </div>
          {getOwner() && getOwner().user.profilePictureURL && (
            <img
              src={`${getImage.url(getOwner().user.profilePictureURL)}`}
              alt={getOwner().team.User_Team.username}
            />
          )}
        </div>
        <div className={styles.user_name}>
          {user && user.id == message.message.ownerId
            ? "You"
            : getOwner() && getOwner().team.User_Team.username}
        </div>
      </div>
    </div>
  );
};

export default Message;
