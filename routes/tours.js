import express from "express";
import {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — tour request from About page
router.post("/", createTour);

// Protected — admin CRUD
router.get("/", protect, getTours);
router.get("/:id", protect, getTour);
router.patch("/:id", protect, updateTour);
router.delete("/:id", protect, deleteTour);

export default router;
