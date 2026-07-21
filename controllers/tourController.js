import TourRequest from "../models/TourRequest.js";

/**
 * GET /api/tours
 * Get all tour requests. Supports ?status=pending filter.
 */
export const getTours = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const tours = await TourRequest.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tours/:id
 * Get a single tour request by ID.
 */
export const getTour = async (req, res, next) => {
  try {
    const tour = await TourRequest.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: "Tour request not found",
      });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tours
 * Create a new tour request (public — from the About page form).
 */
export const createTour = async (req, res, next) => {
  try {
    const tour = await TourRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tours/:id
 * Update tour status or other fields (admin only).
 */
export const updateTour = async (req, res, next) => {
  try {
    const tour = await TourRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: "Tour request not found",
      });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tours/:id
 * Delete a tour request (admin only).
 */
export const deleteTour = async (req, res, next) => {
  try {
    const tour = await TourRequest.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: "Tour request not found",
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
