import styles from "./DropDown.module.scss";

type Props = {
  isOpen: boolean;
  click: () => any;
};

const DropDown = ({ isOpen, click }: Props) => {
  return (
    <div className={`${styles.drop} ${isOpen && styles.drop_open}`}>
      <div title="Log out" onClick={click}>
        Log Out
      </div>
      <div title="Go to profile" onClick={click}>
        Go to Profile
      </div>
    </div>
  );
};

export default DropDown;
