import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: [true, "Image source URL is required"],
  },
  alt: {
    type: String,
    required: [true, "Alt text is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
export default GalleryImage;
