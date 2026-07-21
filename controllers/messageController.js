import Message from "../models/Message.js";

/**
 * GET /api/messages
 * Get all messages sorted by date descending.
 */
export const getMessages = async (_req, res, next) => {
  try {
    const messages = await Message.find().sort({ date: -1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/messages/stats
 * Get unread count and total count for badge display.
 */
export const getMessageStats = async (_req, res, next) => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ read: false });

    res.json({
      success: true,
      data: { total, unread },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/messages/:id
 * Get a single message by ID.
 */
export const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/messages
 * Create a new message (public — from the Contact page form).
 * Accepts either { firstName, lastName } or { name } (auto-split).
 */
export const createMessage = async (req, res, next) => {
  try {
    let { firstName, lastName, name, email, phone, message } = req.body;

    // If a single "name" field is provided, split it
    if (name && !firstName) {
      const parts = name.trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    const newMessage = await Message.create({
      firstName,
      lastName,
      email,
      phone: phone || "",
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/messages/:id
 * Toggle read status or update other fields (admin only).
 */
export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/messages/:id
 * Delete a message (admin only).
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
