import GalleryImage from "../models/GalleryImage.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cloudinary } from "../middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /api/gallery
 * Get all gallery images. Supports ?category=Living filter.
 */
export const getGalleryImages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/gallery
 * Upload a new gallery image (multipart/form-data, admin only).
 * Expects: file (image), alt (string), category (string).
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image file",
      });
    }

    const { alt, category } = req.body;

    if (!alt || !category) {
      return res.status(400).json({
        success: false,
        error: "Alt text and category are required",
      });
    }

    // Determine src URL (Cloudinary returns full HTTPS URL in req.file.path / req.file.secure_url)
    let src = req.file.path || req.file.secure_url;
    
    // If local disk fallback was used (relativize path)
    if (req.file.filename && !src.startsWith("http")) {
      src = `/uploads/gallery/${req.file.filename}`;
    }

    const image = await GalleryImage.create({
      src,
      alt,
      category,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/gallery/:id
 * Update alt text or category (admin only).
 */
export const updateImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    res.json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/gallery/:id
 * Delete a gallery image from DB and remove file from disk or Cloudinary (admin only).
 */
export const deleteImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    // Handle Cloudinary file deletion
    if (image.src && image.src.includes("cloudinary.com")) {
      try {
        // Extract public_id from Cloudinary URL (e.g. firstgate_gallery/1721589123-filename)
        const parts = image.src.split("/");
        const folderAndFile = parts.slice(-2).join("/"); // "firstgate_gallery/filename.jpg"
        const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf("."));
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudErr) {
        console.error("Failed to delete Cloudinary asset:", cloudErr);
      }
    } 
    // Handle Local file deletion
    else if (image.src && image.src.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", image.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
