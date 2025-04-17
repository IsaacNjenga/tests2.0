import { extractTextFromBuffer } from "../middleware/extracter.js";
import UploadModel from "../models/Upload.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from 'axios'

dotenv.config();
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({apiKey});

// const generateSummary = async (text) => {
//   const prompt = `Please summarize the following PDF content:\n\n${text.slice(
//     0,
//     4000
//   )}`;

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful assistant that summarizes documents.",
//       },
//       { role: "user", content: prompt },
//     ],
//     temperature: 0.5,
//   });

//   const summary = response.choices?.[0]?.message?.content?.trim();
//   return summary || "No summary could be generated.";
// };

const generateSummary = async (text) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/summarize",
      {
        text: text.slice(0, 4000), // Cohere recommends under 5000 chars
        length: "long", // short | medium | long | auto
        format: "paragraph", // "bullets" or "paragraph"
        model: "summarize-xlarge", // Best quality
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.summary;
  } catch (error) {
    console.error("Cohere summary error:", error.response?.data || error.message);
    return "Summary unavailable.";
  }
};

const uploadFile = async (req, res) => {
  try {
    const uploadedFile = await Promise.all(
      Object.entries(req.files).map(async ([key, fileArray]) => {
        const file = fileArray[0];
        const extractedText = await extractTextFromBuffer(file.buffer);

        return {
          fieldName: key,
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
          extractedText,
        };
      })
    );

    const summary = await generateSummary(uploadedFile[0].extractedText);

    const newUpload = new UploadModel({
      fieldName: uploadedFile[0].fieldName,
      filename: uploadedFile[0].filename,
      contentType: uploadedFile[0].contentType,
      data: uploadedFile[0].data,
      extractedText: uploadedFile[0].extractedText,
      summary,
    });
    const result = await newUpload.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "File upload failed", error });
  }
};

const getUploads = async (req, res) => {
  try {
    const results = await UploadModel.find({});
    return res.status(201).json({ success: true, results });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Cannot fetch files", error });
  }
};

const fetchFile = async (req, res) => {
  try {
    const uploadedFile = await UploadModel.findOne({
      "files._id": req.params.fileId,
    });

    if (!uploadedFile) {
      return res.status(404).send("File not found");
    }
    const file = uploadedFile.files.id(req.params.fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: error.message });
  }
};

export { uploadFile, getUploads, fetchFile };
