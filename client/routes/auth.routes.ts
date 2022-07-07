export type BODY_SIGN_UP = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export const signUpEndpoint = {
  url: `${process.env.API_URL}/auth/sign-up`,
  method: "post"
};

export type BODY_LOG_IN = {
  email: string;
  password: string;
};

export const logInEndpoint = {
  url: `${process.env.API_URL}/auth/log-in`,
  method: "put"
};

export const logOutEndpoint = {
  url: `${process.env.API_URL}/auth/log-out`,
  method: "put"
};
