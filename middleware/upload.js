import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Lazy initialisation ──────────────────────────────────────────────────────
// In ES Modules all `import` statements are hoisted, so process.env values
// from dotenv may not be set yet at module-evaluation time.
// We defer the Cloudinary config + storage selection to the first request.

let _upload = null;

function getUploader() {
  if (_upload) return _upload;

  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== "your_api_secret"
  );

  let storage;

  if (isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "firstgate_gallery",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (_req, file) => {
          const name = file.originalname.split(".")[0].replace(/\s+/g, "-");
          return `${Date.now()}-${name}`;
        },
      },
    });
  } else {
    // Fallback to local storage if Cloudinary is not yet configured
    const uploadDir = path.join(__dirname, "..", "uploads", "gallery");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadDir),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, uniqueName);
      },
    });
  }

  // File filter — only allow images
  const fileFilter = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
        false
      );
    }
  };

  _upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
    },
  });

  return _upload;
}

// Proxy object — behaves exactly like multer but initialises lazily
const upload = {
  single: (field) => (req, res, next) => getUploader().single(field)(req, res, next),
  array: (field, max) => (req, res, next) => getUploader().array(field, max)(req, res, next),
  fields: (fields) => (req, res, next) => getUploader().fields(fields)(req, res, next),
};

export { cloudinary };
export default upload;
