import TourRequest from "../models/TourRequest.js";
import Message from "../models/Message.js";
import Service from "../models/Service.js";
import GalleryImage from "../models/GalleryImage.js";

/**
 * GET /api/dashboard/stats
 * Aggregated stats for the admin dashboard overview panel.
 */
export const getDashboardStats = async (_req, res, next) => {
  try {
    // Count queries in parallel
    const [upcomingTours, unreadMessages, activeServices, galleryImages] =
      await Promise.all([
        TourRequest.countDocuments({
          status: { $in: ["pending", "confirmed"] },
        }),
        Message.countDocuments({ read: false }),
        Service.countDocuments(),
        GalleryImage.countDocuments(),
      ]);

    // Recent data for quick-glance panels
    const [recentMessages, upcomingToursList] = await Promise.all([
      Message.find().sort({ date: -1 }).limit(3),
      TourRequest.find({
        status: { $in: ["pending", "confirmed"] },
      })
        .sort({ date: 1 })
        .limit(3),
    ]);

    res.json({
      success: true,
      data: {
        upcomingTours,
        unreadMessages,
        activeServices,
        galleryImages,
        recentMessages,
        upcomingToursList,
      },
    });
  } catch (error) {
    next(error);
  }
};
