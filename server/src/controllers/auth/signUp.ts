import { BODY_SIGN_UP } from "./auth.types";
import { RESPONSE } from "../controllers.types";
import bcrypt from "bcryptjs";

// Models
import { User } from "../../models/User";

export const createAccount = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword
    }: BODY_SIGN_UP = req.body;

    let response: RESPONSE = {
      isAuth: false,
      message: "",
      readMsg: true,
      typeMsg: "danger",
      data: {}
    };

    if (!username || !email || !password || !confirmPassword) {
      response.message = "The information is incomplete";
      res.json(response);
      return;
    }

    if (
      username.trim() == "" ||
      email.trim() == "" ||
      password.trim() == "" ||
      confirmPassword.trim() == ""
    ) {
      response.message = "The information is incomplete";
      res.json(response);
      return;
    }

    if (password != confirmPassword) {
      response.message = "Passwords don't match";
      res.json(response);
      return;
    }

    // Check if email already registered
    const users: Array<any> = await User.findAll({
      where: {
        email
      }
    });

    if (users.length > 0) {
      response.message = "The email is already registered";
      res.json(response);
      return;
    }

    // Generate User
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
      globalUsername: username
    });

    response.message = "User created successfuly!";
    response.isAuth = true;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);
  }
};
