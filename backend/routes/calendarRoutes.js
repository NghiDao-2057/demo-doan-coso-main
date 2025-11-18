import express from "express";
import { getCalendarEvents } from "../controllers/calendarController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:userId", verifyToken, getCalendarEvents);

export default router;
