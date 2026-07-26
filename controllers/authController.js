import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Generate a signed JWT for a user.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * POST /api/auth/login
 * Validate credentials and return JWT.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide username and password",
      });
    }

    // Find user and explicitly select the password field
    const user = await User.findOne({ username: username.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Client-side logout (just acknowledge — JWT is stateless).
 */
export const logout = async (_req, res) => {
  res.json({
    success: true,
    data: { message: "Logged out successfully" },
  });
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's info.
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 * Change password and optionally username for current user.
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    if (newUsername && newUsername.trim()) {
      user.username = newUsername.trim().toLowerCase();
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Credentials updated successfully",
      data: {
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};
