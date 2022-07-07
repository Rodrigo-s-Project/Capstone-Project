import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getTeamFromUser,
  getTeamsFromUser,
  createTeam,
  joinTeam
} from "../controllers/dashboard/team/team";

// Protected route
router.get("/get-teams/:companyId", authenticate, getTeamsFromUser);
router.get("/get-team/:id", authenticate, getTeamFromUser);
router.post("/create-team", authenticate, createTeam);
router.put("/join-team", authenticate, joinTeam);

export default router;
