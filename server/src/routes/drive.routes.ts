import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import { getBucketsFromTeam } from "../controllers/drive/buckets/index";
import {
  createFolder,
  getDocumentsFromBucket,
  editFolder,
  deleteFolder
} from "../controllers/drive/documents/index";

import { postFile } from "../controllers/drive/files/index";

// Protected route
router.get("/get-buckets/:companyId/:teamId", authenticate, getBucketsFromTeam);
router.get(
  "/get-documents/:teamId/:bucketId/:folderId",
  authenticate,
  getDocumentsFromBucket
);
router.post("/create-folder", authenticate, createFolder);

router.put("/edit-folder", authenticate, editFolder);
router.delete(
  "/delete-folder/:companyId/:bucketId/:folderId",
  authenticate,
  deleteFolder
);

// Files
// Own middleware
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add-file", authenticate, upload.single("file"), postFile);

export default router;
