const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const Sweet = require("../models/sweet");
const User = require("../models/user");
const { sqs } = require("../config/awsSqsConfig");
const { SendMail } = require("../utils/mailSender");

const processOrder = async (orderData) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({ orderId: orderData.orderId })
      .populate("userId", "email")
      .session(session);

    if (!order) {
      console.error(`Order not found: ${orderData.orderId}`);
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Idempotency check
    if (order.status !== "PENDING") {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Atomic & parallel inventory update
    const updatePromises = order.items.map((item) => {
      console.log(item);
      const sweetId = item.sweetId || item.productId;

      if (!sweetId) {
        throw new Error("INVALID_ORDER_ITEM");
      }

      return Sweet.findOneAndUpdate(
        {
          _id: sweetId,
          quantity: { $gte: item.quantity },
        },
        { $inc: { quantity: -item.quantity } },
        { new: true, session }
      );
    });

    const updatedSweets = await Promise.all(updatePromises);
    console.log("updatedSweets", updatedSweets);

    if (updatedSweets.some((sweet) => !sweet)) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    //  Calculate total amount
    let totalAmount = 0;
    for (let i = 0; i < order.items.length; i++) {
      totalAmount += updatedSweets[i].price * order.items[i].quantity;
    }

    // Update order status
    order.status = "SUCCESSFUL";
    order.totalAmount = totalAmount;
    await order.save({ session });

    // Update user order history
    await User.updateOne(
      { _id: order.userId._id },
      { $push: { orderHistory: order._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Send success email (OUTSIDE transaction)
    const sweetDetails = await Sweet.find({
      _id: { $in: order.items.map((i) => i.sweetId) },
    });

    const sweetMap = new Map(
      sweetDetails.map((s) => [s._id.toString(), s.name])
    );

    const emailBody = `
      Your order <strong>#${
        order.orderId
      }</strong> has been processed successfully.<br><br>
      <strong>Items:</strong><br>
      ${order.items
        .map(
          (item) =>
            `- ${sweetMap.get(item.sweetId.toString())}: ${item.quantity}`
        )
        .join("<br>")}
      <br><br>
      <strong>Total Amount:</strong> ₹${totalAmount}
    `;

    await SendMail({
      to: order.userId.email,
      subject: `Order #${order.orderId} Successful`,
      body: emailBody,
    });

    console.log(`Order ${order.orderId} processed successfully`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(`Order ${orderData.orderId} failed:`, error.message);

    const order = await Order.findOne({ orderId: orderData.orderId }).populate(
      "userId",
      "email"
    );

    if (order) {
      order.status = "FAILED";
      order.failureReason =
        error.message === "INSUFFICIENT_STOCK"
          ? "Insufficient stock"
          : "Processing error";

      await order.save();

      await SendMail({
        to: order.userId.email,
        subject: `Order #${order.orderId} Failed`,
        html: `
          Your order <strong>#${order.orderId}</strong> has failed.<br>
          Reason: ${order.failureReason}
        `,
      });
    }
  }
};

// Poll SQS continuously
const pollQueue = async () => {
  while (true) {
    try {
      const params = {
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 30,
      };

      const { Messages } = await sqs.receiveMessage(params).promise();

      if (!Messages || Messages.length === 0) continue;

      for (const message of Messages) {
        const orderData = JSON.parse(message.Body);

        await processOrder(orderData);

        await sqs
          .deleteMessage({
            QueueUrl: process.env.AWS_SQS_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();
      }
    } catch (err) {
      console.error("Error polling SQS:", err);
    }
  }
};

exports.startWorker = () => {
  console.log("Order worker started...");
  pollQueue();
};
