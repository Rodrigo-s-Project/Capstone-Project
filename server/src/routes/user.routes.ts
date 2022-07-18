import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { editUser } from "../controllers/user/index";

// Protected route
router.put("/edit-user", authenticate, editUser);

export default router;
