import { RESPONSE } from "../controllers.types";
import { BODY_UPDATE_COLOR } from "./main.types";
import { User } from "../../models/User";

export const getUser = (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "success",
    data: {}
  };
  try {

    if (!req.user) {
      res.json(response);
      return;
    }

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

export const updateUserColor = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "success",
    data: {}
  };
  try {
    const { isDarkModeOn }: BODY_UPDATE_COLOR = req.body;

    const user: any = await User.findByPk(req.user.id);
    user.isDarkModeOn = isDarkModeOn;
    await user.save();

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
