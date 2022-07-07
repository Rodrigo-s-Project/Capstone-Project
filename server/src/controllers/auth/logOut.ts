import { RESPONSE } from "../controllers.types";

export const logOut = async (_req, res) => {
  let response: RESPONSE = {
    isAuth: false,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: "None"
    });

    // Everything fine
    response.message = "Successful logout!";
    response.typeMsg = "success";

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
