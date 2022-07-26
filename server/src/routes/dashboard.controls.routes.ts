import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { editSection } from "../controllers/dashboard/controls/index";

// Protected route
router.put("/edit/:companyId", authenticate, editSection);

export default router;
