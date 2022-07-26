import styles from "./Card.module.scss";

type Props = {
  children: any;
  additionalClass?: string;
};

const Card = ({ children, additionalClass }: Props) => {
  return (
    <div className={styles.card} extra-css={additionalClass}>
      {children}
    </div>
  );
};

export default Card;
