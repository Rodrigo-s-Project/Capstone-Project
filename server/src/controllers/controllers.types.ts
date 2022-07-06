export type RESPONSE = {
  isAuth: boolean;
  message: string;
  readMsg: boolean;
  typeMsg: "success" | "danger" | "info";
  data: any;
};
