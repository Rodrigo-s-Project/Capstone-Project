import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getUser, updateUserColor } from "../controllers/main/index";

// Protected route
router.get("/get-user", authenticate, getUser);
router.put("/update-user-color", authenticate, updateUserColor);

export default router;
