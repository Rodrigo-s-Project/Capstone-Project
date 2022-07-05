import express from "express";
const router = express.Router();

import { createAccount } from "../controllers/auth/signUp";

router.post("/sign-up", createAccount);

export default router;
