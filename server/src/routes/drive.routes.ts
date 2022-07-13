import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getBucketsFromTeam } from "../controllers/drive/buckets/index";

// Protected route
router.get("/get-buckets/:companyId/:teamId", authenticate, getBucketsFromTeam);

export default router;
