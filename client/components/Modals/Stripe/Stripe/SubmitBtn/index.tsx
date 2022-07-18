import BtnSpinner from "../../../../Buttons/BtnClick/BtnClick";

type PropsBtn = {
  processing: boolean;
  error: any;
  children: any;
};
export default function SubmitButton({
  processing,
  error,
  children
}: PropsBtn) {
  return (
    <BtnSpinner
      text={children}
      callback={() => {}}
      color={error ? "danger" : "lavender-300"}
      border="round_5"
      role="submit"
      isLoading={processing}
      additionalClass="btn-stripe"
    />
  );
}
