import jwt from "jsonwebtoken";

import { RESPONSE } from "../../controllers/controllers.types";
import { User } from "../../models/User";

export const authenticate = async (req, res, next) => {
  let response: RESPONSE = {
    isAuth: false,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const cookie = req.cookies["jwt"];

    if (!cookie) {
      response.message = "Unauthenticated";
      res.json(response);
      return;
    }

    const claims = jwt.verify(cookie, process.env.JWT_SECRET);

    if (!claims) {
      response.message = "Unauthenticated";
      res.json(response);
      return;
    }

    // User auth
    req.user = await User.findOne({
      where: {
        id: claims._id
      }
    });

    if (!req.user) {
      response.message = "Unauthenticated";
      res.json(response);
      return;
    }

    next();
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
