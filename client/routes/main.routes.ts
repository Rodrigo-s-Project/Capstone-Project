export const getUser = {
  url: `${process.env.API_URL}/get-user`,
  method: "get"
};

export type DATA_GET_USER = {
  id: number;
  email: string;
  globalUsername: string;
  status: string;
  profilePictureURL: string;
  isDarkModeOn: boolean;
};

export const updateUserColor = {
  url: `${process.env.API_URL}/update-user-color`,
  method: "put"
};

export type BODY_UPDATE_COLOR = {
  isDarkModeOn: boolean;
};
