export type BODY_EDIT_USER = {
  type: "password" | "image" | "username";
  value: string;
  confirmVale: string;
  oldvalue: string;
};
