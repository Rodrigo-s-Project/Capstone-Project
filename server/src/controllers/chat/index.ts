import { RESPONSE } from "../controllers.types";
import crypto from "crypto";

export const getHashToken = (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "success",
    data: {}
  };
  try {
    // In this controller the user is already connected
    const algorithm = "aes-256-ctr";
    const iv = crypto.randomBytes(16);
    let key = crypto
      .createHash("sha256")
      .update(String(process.env.JWT_SECRET))
      .digest("base64")
      .substr(0, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(req.user.id.toString()),
      cipher.final()
    ]);

    response.data = {
      tokenForSockets: {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex")
      }
    };

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
