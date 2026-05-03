import express from "express";
import { login, register, getProfile, changePassword, uploadProfilePic } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
router.put(
  "/upload-profile",
  protect,
  upload.single("image"),
  uploadProfilePic
);

export default router;