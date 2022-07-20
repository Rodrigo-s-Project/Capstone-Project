import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getArrayConnections } from "../controllers/chat/connections";

router.get(
  "/connections/get-all-connections/:companyId/:teamId",
  authenticate,
  getArrayConnections
);

export default router;
