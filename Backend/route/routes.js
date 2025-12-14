const express = require("express");
const Router = express.Router();

/* ===================== AUTH CONTROLLERS ===================== */
const { logIn, refreshToken, logout } = require("../controllers/login");
const { signUp, sendOTP } = require("../controllers/register");
const { authenticateUser, isAdmin } = require("../middleware/auth");

/* ===================== ORDER CONTROLLERS ===================== */
const { createOrder, getOrderDetails, getMyOrders } = require("../controllers/order");

/* ===================== SWEET CONTROLLERS ===================== */
const {
  createSweet,
  getSweetPagesCount,
  getSweetsByPage,
  searchSweets,
  updateSweet,
  deleteSweet,
} = require("../controllers/product");

/* ===================== AUTH ROUTES ===================== */
Router.post("/auth/login", logIn);
Router.post("/auth/register", signUp);
Router.post("/auth/emailVerify", sendOTP);
Router.post("/auth/refresh", refreshToken);
Router.post("/auth/logout",logout);

/* ===================== ORDER ROUTES ===================== */
// Create order
Router.post("/sweets/purchase", authenticateUser, createOrder);

// Get logged-in user's order history
Router.get("/orders/me", authenticateUser, getMyOrders);

// Get order details (owner or admin check inside controller)
Router.get("/orders/:id", authenticateUser, getOrderDetails);


/* ====================  INVENTORY MANAGEMENT ROUTES (Admin only)===================== */
// Create sweet 
Router.post("/sweets", authenticateUser, isAdmin, createSweet);

// Update sweet (Admin only)
Router.put("/sweets/:id", authenticateUser, isAdmin, updateSweet);

// Delete sweet (Admin only)
Router.delete("/sweets/:id", authenticateUser, isAdmin, deleteSweet);


/* ====================  INVENTORY MANAGEMENT ROUTES (Admin only)===================== */
// Get total pages
Router.get("/sweets/pages", getSweetPagesCount);

// Get sweets by page
Router.get("/sweets/page/:pageNumber", getSweetsByPage);

// Search sweets
Router.get("/sweets/search", searchSweets);

module.exports = Router;
