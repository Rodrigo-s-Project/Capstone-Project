import styles from "./field.module.scss";

type PropsField = {
  label: string;
  id: string;
  type: "text" | "email" | "tel";
  placeholder: string;
  required: boolean;
  autoComplete: "name" | "email" | "tel";
  value: any;
  onChange: (e: any) => any;
};
export default function Field({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange
}: PropsField) {
  return (
    <div className={styles.row}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
