import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getBucketsFromTeam } from "../controllers/drive/buckets/index";
import {
  createFolder,
  getDocumentsFromBucket
} from "../controllers/drive/documents/index";

// Protected route
router.get("/get-buckets/:companyId/:teamId", authenticate, getBucketsFromTeam);
router.get(
  "/get-documents/:teamId/:bucketId/:folderId",
  authenticate,
  getDocumentsFromBucket
);
router.post("/create-folder", authenticate, createFolder);

export default router;
