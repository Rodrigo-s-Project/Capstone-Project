import { RESPONSE } from "../controllers.types";

export const getUser = (req, res) => {
  try {
    let response: RESPONSE = {
      isAuth: true,
      message: "",
      readMsg: false,
      typeMsg: "success",
      data: {}
    };

    const { password, ...userData } = req.user.toJSON();

    response.data = userData;
    res.json(response);
  } catch (error) {
    console.error(error);
  }
};
