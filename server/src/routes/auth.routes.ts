import express from "express";
const router = express.Router();

import { createAccount } from "../controllers/auth/signUp";
import { logIn } from "../controllers/auth/logIn";

router.post("/sign-up", createAccount);
router.put("/log-in", logIn);

export default router;
