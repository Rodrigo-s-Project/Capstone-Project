import styles from "./Bar.module.scss";

const Bar = () => {
  return (
    <div className={styles.bar}>
      <input
        placeholder="Write a message here"
        type="text"
        name="chat"
        id="main-chat-input"
      />
    </div>
  );
};
export default Bar;
