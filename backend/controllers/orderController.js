const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// GET A SINGLE ORDER WITH STRIPE SESSION ID FOR SUCCESS PATH
const getOrder = async (req, res) => {
  const { sessionId } = req.params;

  try {
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required." });
    }

    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate("user_id", "name email")
      .populate("items.product_id", "title images");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      msg: "Order fetched successfully",
      order,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Could not retrieve order details." });
  }
};

// Fetch all product orders
const productOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const status = req.query.status;
    let filter = { "items.type": "product" };

    if (status && status !== "all") {
      filter.orderStatus = status;
    }

    const totalOrders = await Order.countDocuments(filter);

    const products = await Order.find(filter).sort({ createdAt: -1 }).populate({
      path: "items.product_id",
      select: "title image images price",
    });

    res.status(200).json({
      msg: "Product orders fetched successfully",
      products,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching product orders:", error);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

// GET ALL ORDERS FOR A USER
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product_id",
        select: "title image images price",
      });

    res.status(200).send({ msg: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

// CANCEL ORDER (AND REFUND IF NEEDED)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Received orderId:", orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order not found for ID:", orderId);
      return res.status(404).json({ msg: "Order not found" });
    }

    console.log("Found order:", order);

    if (order.user_id.toString() !== req.user.userId) {
      console.log("Unauthorized access attempt by user:", req.user.userId);
      return res
        .status(403)
        .json({ msg: "You are not authorized to cancel this order." });
    }

    if (
      order.user_id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to cancel this order." });
    }

    console.log("Logged-in user ID:", req.user.userId);
    console.log("Order user ID:", order.user_id.toString());

    if (order.paymentStatus === "paid") {
      if (!order.stripePaymentIntentId) {
        console.log("No paymentIntentId found for order:", orderId);
        return res
          .status(400)
          .json({ msg: "No paymentIntentId found for this order" });
      }

      console.log(
        "Attempting to refund payment with paymentIntentId:",
        order.paymentIntentId
      );

      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });

      order.orderStatus = "canceled";
      order.paymentStatus = "refunded";
      await order.save();

      console.log("Updated order status after refund:", order.orderStatus);
      return res
        .status(200)
        .json({ msg: "Order refunded successfully", refund });
    } else {
      console.log("Cancelling order without refund. Updating status...");

      order.orderStatus = "canceled";
      order.paymentStatus = "cancelled";
      await order.save();

      console.log("Updated order status:", order.orderStatus);
      return res.status(200).json({ msg: "Order canceled successfully" });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ msg: "Could not cancel order", error });
  }
};

// UPDATE ORDER STATUS OR PAYMENT STATUS (For Admin Only)

const STATUS_FLOW = ["processing", "shipped", "delivered", "canceled"];

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (orderStatus) {
      const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
      const nextIdx = STATUS_FLOW.indexOf(orderStatus);

      if (nextIdx === -1)
        return res
          .status(400)
          .json({ msg: `Invalid orderStatus "${orderStatus}".` });

      if (nextIdx < currentIdx)
        return res.status(400).json({
          msg: `Cannot change status from "${order.orderStatus}" to "${orderStatus}".`,
        });

      if (order.orderStatus === "canceled")
        return res
          .status(400)
          .json({ msg: "Canceled orders cannot be modified." });

      order.orderStatus = orderStatus;
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    return res.status(200).json({ msg: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ msg: "Could not update order status", error });
  }
};

module.exports = {
  getOrder,
  productOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
};
