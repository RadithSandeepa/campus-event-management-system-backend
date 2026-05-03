import express from "express";

import {
  createUser,
  getUsers,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADMIN ONLY
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createUser
);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getUsers
);

export default router;