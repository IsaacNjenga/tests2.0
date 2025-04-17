import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Connection = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Database Connected!");
  } catch (error) {
    console.log("Error connecting to the DB:", error);
  }
};

Connection();
