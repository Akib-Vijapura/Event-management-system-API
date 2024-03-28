import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = () => {
  try {
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error :"));
    db.once("open", () => {
      logger.info(`MongoDB connected to ${db.host}`);
    });
  } catch (error) {
    logger.error(`Error ⚠️: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
