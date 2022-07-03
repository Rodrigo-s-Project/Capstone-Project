import styles from "../Btn.module.scss";
import Link from "next/link";

type Props = {
  text: string;
  url: string;
  color: "lavender-300" | "lavender-200" | "gray";
  border: "complete_rounded" | "round_5";
  additionalClass?: string;
  title?: string;
  callback?: () => any;
};

const BtnLink = ({
  text,
  url,
  color,
  border,
  additionalClass = "",
  title = `Go to ${text}`,
  callback
}: Props) => {
  return (
    <Link href={url}>
      <a
        extra-css={additionalClass}
        title={title}
        className={`${styles.btn} ${styles[color]} ${styles[border]}`}
        onClick={callback}
      >
        {text}
      </a>
    </Link>
  );
};

export default BtnLink;
