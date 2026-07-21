import mongoose from "mongoose";

const tourRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Visitor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    time: {
      type: String,
      default: "10:00 AM",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const TourRequest = mongoose.model("TourRequest", tourRequestSchema);
export default TourRequest;
