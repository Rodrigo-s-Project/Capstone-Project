export type BODY_EDIT_USER = {
  type: "password" | "image";
  value: string;
  confirmVale: string;
  oldvalue: string;
};

export const updateUser = {
  url: `${process.env.API_URL}/profile/edit-user`,
  method: "put"
};
