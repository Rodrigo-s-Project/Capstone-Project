import express from "express";
const router = express.Router();

import { createAccount } from "../controllers/auth/signUp";
import { logIn } from "../controllers/auth/logIn";
import { logOut } from "../controllers/auth/logOut";
import { authenticate } from "../middlewares/auth/index";

router.post("/sign-up", createAccount);
router.put("/log-in", logIn);
router.put("/log-out", authenticate, logOut);

export default router;
