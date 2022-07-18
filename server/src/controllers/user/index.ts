import { RESPONSE } from "../controllers.types";
import { BODY_EDIT_USER } from "./user.types";
import bcrypt from "bcryptjs";

export const editUser = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "success",
    data: {}
  };
  try {
    const { type, value, confirmVale, oldvalue }: BODY_EDIT_USER = req.body;

    if (value.trim() == "") {
      response.message = "Incomplete information";
      res.json(response);
      return;
    }

    if (type == "password") {
      // Update password
      if (value != confirmVale) {
        response.message = "Passwords don't match";
        res.json(response);
        return;
      }

      const comparison = await bcrypt.compare(oldvalue, req.user.password);

      if (!comparison) {
        response.message = "Incorrect password";
        res.json(response);
        return;
      }

      // Generate hash password
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(value, salt);

      await req.user.update({
        password: hashedPassword
      });

      res.json(response);
      return;
    }

    if (type == "image") {
      await req.user.update({
        profilePictureURL: value
      });

      res.json(response);
      return;
    }
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
