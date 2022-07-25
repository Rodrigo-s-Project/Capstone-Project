import express from "express";
const router = express.Router();

import { getHashToken } from "../controllers/chat/index";
import { authenticate } from "../middlewares/auth/index";

router.get("/generate-ticket", authenticate, getHashToken);

export default router;
