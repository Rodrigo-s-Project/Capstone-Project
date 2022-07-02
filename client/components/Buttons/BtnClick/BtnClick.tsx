import styles from '../Btn.module.scss';

type Props = {
    text: string,
    callback: () => any,
    color: 'lavender-300' | 'lavender-200' | 'gray',
    border: 'complete_rounded' | 'round_5',
    additionalClass?: string
}

const BtnClick = ({ text, callback, color, border, additionalClass = '' }: Props) => {
    return (
        <button extra-css={additionalClass} onClick={callback} className={`${styles.btn} ${styles[color]} ${styles[border]}`}>
            {text}
        </button>
    )
};

export default BtnClick;