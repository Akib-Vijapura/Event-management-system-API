import dotenv from "dotenv";
import express from "express";
const app = express();
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";

//Connect to DB
connectDB();

//Importing routers
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 5100;

app.use(express.json());

app.use("/api/v1/events", eventRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
