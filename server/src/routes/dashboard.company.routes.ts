import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { isAdmin } from "../middlewares/admin/index";
import {
  getCompaniesFromUser,
  createCompany,
  joinCompany,
  getCompanyFromUser,
  getCompanyUsersFromId
} from "../controllers/dashboard/company/company";

// Protected route
router.get("/get-companies", authenticate, getCompaniesFromUser);
router.get("/get-company/:id", authenticate, getCompanyFromUser);
router.get(
  "/get-company-users/:id",
  authenticate,
  (req, res, next) => {
    isAdmin(req, res, next, "id");
  },
  getCompanyUsersFromId
);
router.post("/create-company", authenticate, createCompany);
router.put("/join-company", authenticate, joinCompany);

export default router;
