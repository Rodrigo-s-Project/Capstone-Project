import jwt from "jsonwebtoken";

import { RESPONSE } from "../../controllers/controllers.types";
import { User } from "../../models/User";

export const authenticate = async (req, res, next) => {
  try {
    const cookie = req.cookies["jwt"];

    const claims = jwt.verify(cookie, process.env.JWT_SECRET);

    let response: RESPONSE = {
      isAuth: false,
      message: "",
      readMsg: true,
      typeMsg: "danger",
      data: {}
    };

    if (!claims) {
      response.message = "Unauthenticated";
      res.json(response);
    }

    // User auth
    req.user = await User.findOne({
      where: {
        id: claims._id
      }
    });

    next();
  } catch (error) {
    console.error(error);
  }
};
