import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    fieldName: { type: String },
    filename: { type: String },
    contentType: { type: String },
    data: { type: Buffer },
    extractedText: { type: String },
    summary: { type: String },
  },
  { collection: "upload", timestamps: true }
);

const UploadModel = mongoose.model("upload", uploadSchema);
export default UploadModel;
