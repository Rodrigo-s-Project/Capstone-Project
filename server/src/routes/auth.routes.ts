import express from "express";
const router = express.Router();

import { createAccount } from "../controllers/auth/signUp";
import { logIn } from "../controllers/auth/logIn";

router.post("/sign-up", createAccount);
router.get("/log-in", logIn);

export default router;
