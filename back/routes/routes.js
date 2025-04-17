import express from "express";
import {
  getUploads,
  uploadFile,
  fetchFile,
} from "../controllers/uploadController.js";
import uploadFiles from "../middleware/uploadFiles.js";

const router = express.Router();

//upload routes
router.post("/uploadFiles", uploadFiles, uploadFile);
router.get("/file/:fileId", fetchFile);
router.get("/getUploads", getUploads);

export { router as Router };
