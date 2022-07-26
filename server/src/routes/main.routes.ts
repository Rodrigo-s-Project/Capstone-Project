import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getUser, updateUserColor } from "../controllers/main/index";

// Protected route
router.get("/get-user", authenticate, getUser);
router.put("/update-user-color", authenticate, updateUserColor);

// import { User } from "../models/User";
// import { Team } from "../models/Team";
// import { Company } from "../models/Company";

// router.get("/secret", async (req, res) => {
//   const companies: Array<any> = await Company.findAll();
//   const teams: Array<any> = await Team.findAll();
//   const users: Array<any> = await User.findAll();

//   let aux: Array<string> = [];

//   for (let i = 0; i < companies.length; i++) {
//     aux.push(companies[i].companyPictureURL);
//   }
//   for (let i = 0; i < teams.length; i++) {
//     aux.push(teams[i].teamPictureURL);
//   }
//   for (let i = 0; i < users.length; i++) {
//     aux.push(users[i].profilePictureURL);
//   }

//   res.send(aux);
// });

export default router;
