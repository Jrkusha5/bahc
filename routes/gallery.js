import express from "express";
import {
  getGalleryImages,
  uploadImage,
  updateImage,
  deleteImage,
} from "../controllers/galleryController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public — fetch gallery images for the public Gallery page
router.get("/", getGalleryImages);

// Protected — admin operations
router.post("/", protect, upload.single("image"), uploadImage);
router.patch("/:id", protect, updateImage);
router.delete("/:id", protect, deleteImage);

export default router;
