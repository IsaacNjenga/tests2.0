import express from "express";
import {
  getUploads,
  uploadFile,
  fetchFile,
} from "../controllers/uploadController.js";
import uploadFiles from "../middleware/uploadFiles.js";
import { chatWithCohere } from "../controllers/chatbotController.js";

const router = express.Router();

//upload routes
router.post("/uploadFiles", uploadFiles, uploadFile);
router.get("/file/:fileId", fetchFile);
router.get("/getUploads", getUploads);

//chatbot routes
router.post("/chatbot", chatWithCohere);

export { router as Router };
