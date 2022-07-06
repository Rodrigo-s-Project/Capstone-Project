import styles from "./InputText.module.scss";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";

type Props = {
  text: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  id: string;
  name?: string;
  type: "text" | "email" | "password";
  onChange?: () => any;
};

const InputText = ({
  text,
  value,
  setValue,
  id,
  name,
  type,
  onChange
}: Props) => {
  const [open, setOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (value != "" && !hasClicked) {
      setOpen(true);
    }
  }, [value, hasClicked]);

  return (
    <div
      tabIndex={-1}
      onFocus={() => {
        setHasClicked(true);
        setOpen(true);
        if (inputRef.current != null) {
          (inputRef.current as any).focus();
        }
      }}
      onBlur={() => {
        if (value == "") {
          setOpen(false);
        }
      }}
      className={styles.input}
    >
      <label
        className={`${styles.input_label} ${open && styles.open}`}
        htmlFor={id}
      >
        {text}
      </label>
      <input
        ref={inputRef}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          if (onChange) onChange();
        }}
        type={type}
        name={name}
        id={id}
      />
    </div>
  );
};

export default InputText;
