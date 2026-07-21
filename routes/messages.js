import express from "express";
import {
  getMessages,
  getMessageStats,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — contact form submission
router.post("/", createMessage);

// Protected — admin operations
router.get("/stats", protect, getMessageStats);
router.get("/", protect, getMessages);
router.get("/:id", protect, getMessage);
router.patch("/:id", protect, updateMessage);
router.delete("/:id", protect, deleteMessage);

export default router;
