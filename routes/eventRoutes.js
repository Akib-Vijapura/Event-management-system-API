import express from "express";
const router = express.Router();
import {
  findEvents,
  createEvent,
  loadEventsFromCSV,
} from "../controllers/eventController.js";

router.route("/upload").get(loadEventsFromCSV);
router.route("/create").post(createEvent);
router.route("/find").post(findEvents);
export default router;

