import mongoose from "mongoose";
import { DB_URI } from "./env.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log(
      "Failed to connect to DATABASE, check DB_URI in .env.<production|development>.local"
    );
  }
};

export default connectToDatabase;
