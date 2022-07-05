import { BODY_LOG_IN } from "./auth.types";
import { RESPONSE } from "../controllers.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Models
import { User } from "../../models/User";

export const logIn = async (req, res) => {
  try {
    const { email, password }: BODY_LOG_IN = req.body;

    let response: RESPONSE = {
      isAuth: false,
      message: "",
      readMsg: true,
      typeMsg: "danger",
      data: {}
    };

    if (!email || !password) {
      response.message = "The information is incomplete";
      res.json(response);
      return;
    }

    if (email.trim() == "" || password.trim() == "") {
      response.message = "The information is incomplete";
      res.json(response);
      return;
    }

    // First find user by "email"
    const user: any = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      response.message = "User not found";
      res.status(404).json(response);
      return;
    }

    // Check password
    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison) {
      response.message = "Incorrect password";
      res.status(400).json(response);
      return;
    }

    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    response.isAuth = true;
    response.readMsg = false;
    response.typeMsg = "success";

    // So Password if not sent
    const { password: userPswd, ...userData } = user.toJSON();

    response.data = userData;
    res.json(response);
  } catch (error) {}
};
