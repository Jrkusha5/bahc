import Service from "../models/Service.js";
const INITIAL_DEFAULT_SERVICES = [
  {
    title: "24/7 Attentive Care",
    description:
      "Our licensed caregivers are awake and available around the clock, providing absolute peace of mind for both residents and their families.",
    icon: "🛡️",
    order: 1,
  },
  {
    title: "Medication Management",
    description:
      "Strict, RN-supervised protocols for medication administration, handling prescription refills and coordinating with pharmacies and physicians.",
    icon: "💊",
    order: 2,
  },
  {
    title: "Personal Hygiene",
    description:
      "Respectful assistance with activities of daily living including bathing, grooming, dressing, and incontinence care.",
    icon: "🛁",
    order: 3,
  },
  {
    title: "Nutritional Diet",
    description:
      "Three delicious, balanced meals and snacks daily accommodating specialized diets including diabetic, low-sodium, and allergy-specific requirements.",
    icon: "🍽️",
    order: 4,
  },
  {
    title: "Memory & Dementia Care",
    description:
      "Secure, structured environment designed to minimize confusion and anxiety through cognitive therapies, familiar routines, and sensory activities.",
    icon: "🧠",
    order: 5,
  },
  {
    title: "Mobility & Rehab Support",
    description:
      "Coordination with visiting physical and occupational therapists, featuring zero-entry showers, widened doorways, and safety rails.",
    icon: "🏃",
    order: 6,
  },
];
/**
 * GET /api/services
 * Get all services sorted by order field. Auto-seeds defaults if DB is empty.
 */
export const getServices = async (_req, res, next) => {
  try {
    let services = await Service.find().sort({ order: 1, createdAt: 1 });
    if (services.length === 0) {
      services = await Service.insertMany(INITIAL_DEFAULT_SERVICES);
    }
    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/services/:id
 * Get a single service by ID.
 */
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};
/**
 * POST /api/services
 * Create a new service (admin only).
 */
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * PUT /api/services/:id
 * Update a service (admin only).
 */
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};
/**
 * DELETE /api/services/:id
 * Delete a service (admin only).
 */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
