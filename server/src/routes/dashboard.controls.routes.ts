import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { isAdmin } from "../middlewares/admin/index";
import { editSection } from "../controllers/dashboard/controls/index";

// Protected route
router.put(
  "/edit/:companyId",
  authenticate,
  (req, res, next) => {
    isAdmin(req, res, next, "companyId");
  },
  editSection
);

export default router;
