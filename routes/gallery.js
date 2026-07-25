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
// Wrap multer upload in error handler to catch Cloudinary credential / upload failures
router.post("/", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Cloudinary errors often come back as status 403 (invalid credentials) or 401
      const statusCode = err.http_code || err.statusCode || 400;
      const message =
        err.message || "Image upload failed. Please check server configuration.";
      console.error("[Gallery Upload Error]", err);
      return res.status(statusCode).json({
        success: false,
        error: `Upload failed: ${message}`,
      });
    }
    next();
  });
}, uploadImage);
router.patch("/:id", protect, updateImage);
router.delete("/:id", protect, deleteImage);

export default router;
