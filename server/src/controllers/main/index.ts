import { RESPONSE } from "../controllers.types";

export const getUser = (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "success",
    data: {}
  };
  try {
    const { password, ...userData } = req.user.toJSON();

    response.data = userData;
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
