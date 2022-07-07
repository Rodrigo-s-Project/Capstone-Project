import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getCompaniesFromUser,
  createCompany,
  joinCompany,
  getCompanyFromUser
} from "../controllers/dashboard/company/company";

// Protected route
router.get("/get-companies", authenticate, getCompaniesFromUser);
router.get("/get-company/:id", authenticate, getCompanyFromUser);
router.post("/create-company", authenticate, createCompany);
router.put("/join-company", authenticate, joinCompany);

export default router;
