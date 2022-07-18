export type BODY_EDIT_USER = {
  type: "password" | "image";
  value: string;
  confirmVale: string
  oldvalue: string
};
