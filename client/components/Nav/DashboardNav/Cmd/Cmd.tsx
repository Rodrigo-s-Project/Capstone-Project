import styles from "./Cmd.module.scss";
import Search from "../../../Svgs/Search";
import { useState, useEffect, useRef, useCallback } from "react";

import { RULES } from "./rules";
import { similarity } from "../../../../utils/similarity";

import { useCommands } from "../../../../hooks/useCommands";

const PERCENTAGE = 0.25;

const Cmd = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedCommand, setSelectedCommand] = useState<number>(-1);
  const [hasClicked, setHasClicked] = useState(false);
  const inputRef = useRef(null);
  const { execCmd } = useCommands();

  useEffect(() => {
    if (value != "" && !hasClicked) {
      setOpen(true);
    }
  }, [value, hasClicked]);

  const executeCommand = (rule: string) => {
    execCmd(rule);

    setValue("");
    setSelectedCommand(-1);
  };

  const getCommandsArray = useCallback((): Array<string> => {
    if (value == "/") return RULES;

    return RULES.filter(
      (rule: string) => similarity(rule, value) >= PERCENTAGE
    );
  }, [value]);

  const handleKey = useCallback(
    (event: any) => {
      if (!open) return;

      if (
        event.key != "ArrowDown" &&
        event.key != "ArrowUp" &&
        event.key != "Enter"
      )
        return;

      event.preventDefault();

      if (event.key == "Enter") {
        executeCommand(getCommandsArray()[selectedCommand]);
        return;
      }

      let newValue: number = selectedCommand;

      if (newValue <= 0 && event.key == "ArrowUp") {
        newValue = getCommandsArray().length - 1;
      } else if (
        newValue >= getCommandsArray().length - 1 &&
        event.key == "ArrowDown"
      ) {
        newValue = 0;
      } else if (event.key == "ArrowUp") {
        newValue -= 1;
      } else if (event.key == "ArrowDown") {
        newValue += 1;
      }

      setSelectedCommand(newValue);
    },
    [open, selectedCommand]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

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
          setSelectedCommand(-1);
        }}
        placeholder="Search or type a /command"
        className={styles.cmd_input}
        type="text"
      />
      {value.trim() != "" && (
        <div className={styles.results_container}>
          {getCommandsArray().length == 0 && (
            <div className={styles.noCommands}>No commands</div>
          )}
          {getCommandsArray().map((rule: string, index: number) => {
            return (
              <div
                className={`${styles.results_container_cmd} ${selectedCommand ==
                  index && styles.selected}`}
                key={index}
                onClick={() => {
                  setSelectedCommand(index);
                  executeCommand(rule);
                }}
              >
                {rule}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cmd;
