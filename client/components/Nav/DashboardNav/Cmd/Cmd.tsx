import styles from "./Cmd.module.scss";
import Search from "../../../Svgs/Search";
import { useState, useEffect, useRef } from "react";

const Cmd = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
      className={`${styles.cmd} ${open && styles.cmd_open}`}
      title="Command tool"
    >
      <div className={styles.cmd_icon}>
        <Search />
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        placeholder="Search or type a /command"
        className={styles.cmd_input}
        type="text"
      />
    </div>
  );
};

export default Cmd;
