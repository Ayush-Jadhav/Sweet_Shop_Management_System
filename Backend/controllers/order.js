const Order = require("../models/orderSchema");
const { v4: uuidv4 } = require("uuid");
const { sendMessageToSQS } = require("../utils/sqsHelper");
const redisClient = require("../config/redisConfig");

/**
 * CREATE ORDER
 * POST /api/orders
 */
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
      });
    }

    const order = await Order.create({
      orderId: uuidv4(),
      userId,
      items,
      status: "PENDING",
    });

    try {
      await sendMessageToSQS({
        orderId: order.orderId,
      });
    } catch (sqsError) {
      // Prevent stuck orders
      order.status = "FAILED";
      order.failureReason = "Failed to enqueue order";
      await order.save();

      return res.status(500).json({
        success: false,
        message: "Failed to process order request",
      });
    }

    return res.status(202).json({
      success: true,
      orderId: order.orderId,
      message: "Order queued for processing",
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/orders/me
 * Get order history of logged-in user
 */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .select("orderId status totalAmount createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
    });
  }
};

/**
 * GET ORDER DETAILS
 * GET /api/orders/:id
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Redis lookup
    const cachedOrder = await redisClient.get(`order:${id}`);
    if (cachedOrder) {
      const order = JSON.parse(cachedOrder);

      if (order.userId !== userId.toString() && userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    }

    // DB query with populate
    const order = await Order.findOne({ orderId: id })
      .populate({
        path: "items.sweetId",
        select: "name price", // only required fields
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.userId.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Cache populated order
    await redisClient.setEx(`order:${id}`, 600, JSON.stringify(order));

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
