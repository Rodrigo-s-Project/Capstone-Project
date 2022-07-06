import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";

router.get("/", authenticate, (req, res) => {
  res.json({
    msg: `Hi ${req.user.globalUsername}`
  });
});

export default router;
