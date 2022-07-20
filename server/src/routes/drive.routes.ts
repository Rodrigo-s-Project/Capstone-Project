import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth/index";
import {
  getBucketsFromTeam,
  createBucket,
  kickAddUserToBucket,
  editNameBucket,
  deleteBucket
} from "../controllers/drive/buckets/index";
import {
  createFolder,
  getDocumentsFromBucket,
  editFolder,
  deleteFolder
} from "../controllers/drive/documents/index";

import {
  postFile,
  getFile,
  downloadFileDeleteTemp
} from "../controllers/drive/files/index";
import { editFile, deleteFile } from "../controllers/drive/files/edits";

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
router.get("/get-file/:idFile", authenticate, getFile);
router.delete("/delete-file/:idFile", authenticate, downloadFileDeleteTemp);

router.put("/edit-file", authenticate, editFile);
router.delete(
  "/delete-file-db/:companyId/:bucketId/:fileId",
  authenticate,
  deleteFile
);

// Admin and employeez
router.post("/bucket/create", authenticate, createBucket);
router.put("/bucket/kick", authenticate, kickAddUserToBucket);
router.put("/bucket/edit", authenticate, editNameBucket);
router.put("/bucket/delete", authenticate, deleteBucket);

export default router;
