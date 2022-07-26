import styles from "./Messages.module.scss";
import { Dispatch, SetStateAction } from "react";

// Icon
import TimesIcon from "../../Svgs/Times";
import InfoIcon from "../../Svgs/Info";
import DangerIcon from "../../Svgs/Danger";
import CheckIcon from "../../Svgs/Check";

export type Message = {
  text: string;
  type: "success" | "danger" | "info";
};

type Props = {
  arrayMsgs: Array<Message>;
  setArrayMsgs: Dispatch<SetStateAction<Array<Message>>>;
};

const Messages = ({ arrayMsgs, setArrayMsgs }: Props) => {
  const deleteMsg = (index: number) => {
    let auxArr: Array<Message> = [];
    for (let i = 0; i < arrayMsgs.length; i++) {
      if (i == index) continue;
      auxArr.push(arrayMsgs[i]);
    }

    setArrayMsgs(auxArr);
  };

  return (
    <div className={styles.msgs}>
      {arrayMsgs.map((msg: Message, index: number) => {
        return (
          <div key={index} className={`${styles.msg} ${styles[msg.type]}`}>
            <div className={styles.msg_container}>
              <div>
                {msg.type == "danger" && <DangerIcon />}
                {msg.type == "info" && <InfoIcon />}
                {msg.type == "success" && <CheckIcon />}
              </div>
              <div title={msg.text} className={styles.msg_text}>
                {msg.text}
              </div>
            </div>
            <button
              onClick={() => {
                deleteMsg(index);
              }}
              title="Close message"
            >
              <TimesIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
