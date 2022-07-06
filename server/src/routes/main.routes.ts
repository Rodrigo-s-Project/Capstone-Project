import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getUser } from "../controllers/main/index";

// Protected route
router.get("/get-user", authenticate, getUser);

export default router;
