import jwt from "jsonwebtoken";

import { RESPONSE } from "../../controllers/controllers.types";
import { User } from "../../models/User";

export const isAdmin = async (req, res, next, idParam) => {
  let response: RESPONSE = {
    isAuth: false,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const cookie = req.cookies["jwt"];
    const idCompany = parseInt(req.params[idParam]);

    if (!cookie) {
      response.message = "Unauthenticated";
      res.json(response);
      return;
    }

    if (isNaN(idCompany)) {
      response.message = "Unauthorized";
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
    const userRef: any = await User.findOne({
      where: {
        id: claims._id
      }
    });

    const companyRef: any = await userRef.getCompanies({
      where: {
        id: idCompany
      }
    });

    if (!companyRef || companyRef.length == 0) {
      response.message = "Unauthorized";
      res.json(response);
      return;
    }

    if (userRef.id != companyRef[0].adminId) {
      response.message = "Unauthorized";
      res.json(response);
      return;
    }

    // With auth and with admin credentials
    req.user = userRef;

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
