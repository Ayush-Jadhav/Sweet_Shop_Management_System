// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redisConfig");
require("dotenv").config();

exports.authenticateUser = async (req, res, next) => {
  try {
    let token;

    // Try cookie first (PRIMARY)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;

    // Redis cache check
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // DB lookup
    const user = await User.findById(userId).select(
      "_id email role firstName lastName"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Cache user (1 hour)
    await redisClient.setEx(
      `user:${userId}`,
      3600,
      JSON.stringify(user)
    );

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * Admin-only middleware
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admins only",
    });
  }
  next();
};
