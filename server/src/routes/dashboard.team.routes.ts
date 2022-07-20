import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getTeamFromUser,
  getTeamsFromUser,
  createTeam,
  joinTeam,
  getTeamUsersFromId
} from "../controllers/dashboard/team/team";

// Protected route
router.get("/get-teams/:companyId", authenticate, getTeamsFromUser);
router.get("/get-team/:idCompany/:idTeam", authenticate, getTeamFromUser);
router.get(
  "/get-team-users/:idCompany/:idTeam",
  authenticate,
  getTeamUsersFromId
);
router.post("/create-team", authenticate, createTeam);
router.put("/join-team", authenticate, joinTeam);

export default router;
