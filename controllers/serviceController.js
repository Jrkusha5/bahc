import Service from "../models/Service.js";

/**
 * GET /api/services
 * Get all services sorted by order field.
 */
export const getServices = async (_req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });

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
    const { title, name, description, details, text, icon, order } = req.body;

    const serviceTitle = (title || name || "").trim();
    const serviceDescription = (description || details || text || "").trim();

    if (!serviceTitle || !serviceDescription) {
      return res.status(400).json({
        success: false,
        error: "Service title and description are required",
      });
    }

    // Auto-assign next order if not explicitly specified
    let serviceOrder = order;
    if (serviceOrder === undefined || serviceOrder === null) {
      const maxOrderService = await Service.findOne().sort({ order: -1 });
      serviceOrder = maxOrderService && typeof maxOrderService.order === "number" ? maxOrderService.order + 1 : 1;
    }

    const service = await Service.create({
      title: serviceTitle,
      description: serviceDescription,
      icon: icon && icon.trim() ? icon.trim() : "⭐",
      order: serviceOrder,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT / PATCH /api/services/:id
 * Update a service (admin only).
 */
export const updateService = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (updateData.name && !updateData.title) {
      updateData.title = updateData.name;
    }
    if ((updateData.details || updateData.text) && !updateData.description) {
      updateData.description = updateData.details || updateData.text;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, {
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
