// prev = "/files"

import express from "express";
const router = express.Router();

import {
  uploadImage,
  getImage,
  deleteImage,
  // secretThings
} from "../controllers/images/index";
import upload from "../middlewares/images/upload";

router.post("/upload", upload.single("file"), uploadImage);
router.get("/image/:filename", getImage);
router.delete("/image/:filename", deleteImage);

// router.get("/secret", secretThings);

export default router;
