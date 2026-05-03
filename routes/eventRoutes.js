import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getEvents);
router.get("/:id", getEventById);

// ORGANIZER + ADMIN
router.post(
  "/",
  protect,
  authorizeRoles("ORGANIZER", "ADMIN"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ORGANIZER", "ADMIN"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ORGANIZER", "ADMIN"),
  deleteEvent
);

export default router;