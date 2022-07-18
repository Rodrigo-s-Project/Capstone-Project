export type BODY_EDIT_USER = {
  type: "password" | "image" | "username";
  value: string;
  confirmVale: string
  oldvalue: string
};

export const updateUser = {
  url: `${process.env.API_URL}/profile/edit-user`,
  method: "put"
};
