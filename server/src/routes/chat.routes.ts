import express from "express";
const router = express.Router();

import { getHashToken } from "../controllers/chat/index";
import {
  createConnection,
  editConnection,
  deleteConnection,
  addRemoveUserConnection
} from "../controllers/chat/connections";
import { authenticate } from "../middlewares/auth/index";

router.get("/generate-ticket", authenticate, getHashToken);

router.post("/create-connection", authenticate, createConnection);
router.put("/edit-connection", authenticate, editConnection);
router.put("/delete-connection", authenticate, deleteConnection);
router.put(
  "/add-remove-user-connection",
  authenticate,
  addRemoveUserConnection
);

export default router;
