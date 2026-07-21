import express from "express";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — fetch services for the public Services page
router.get("/", getServices);

// Protected — admin CRUD
router.get("/:id", protect, getService);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
