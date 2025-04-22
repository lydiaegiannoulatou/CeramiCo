const Order = require("../models/orderModel");
const Product = require("../models/productModel")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe init

// GET A SINGLE ORDER
const getOrder = async (req, res) => {
  const { sessionId } = req.params;

  try {
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required." });
    }

    // Find the order by sessionId and populate user details
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate("user_id", "name email") // Populate user details
      .populate("items.product_id", "title images")


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
    const products = await Order.find({ "items.type": "product" })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.product_id', // Populate product_id for product items
        select: 'title image images price',
      });

    console.log('Fetched product orders:', products);  // Log the result

    if (!products || products.length === 0) {
      return res.status(200).json({ msg: "No product orders found", products: [] });
    }

    res.status(200).json({ msg: "Product orders fetched successfully", products });
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
        path: 'items.product_id', // Populate product_id for product items
        select: 'title image images price',
      })
     
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
    console.log("orderId", orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Ensure the logged-in user owns this order
    if (order.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "You are not authorized to cancel this order." });
    }

    // Only refund if the order is paid
    if (order.paymentStatus === "paid") {
      if (!order.paymentIntentId) {
        return res.status(400).json({ msg: "No paymentIntentId found for this order" });
      }

      const refund = await stripe.refunds.create({
        payment_intent: order.paymentIntentId,
      });

      order.orderStatus = "refunded";
      order.paymentStatus = "refunded";
      await order.save();

      console.log("Updated order status:", order.orderStatus);
      return res.status(200).json({ msg: "Order refunded successfully", refund });
    } else {
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
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    // Fetch the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    // Update order status and payment status
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Save the updated order
    await order.save();

    res.status(200).json({ msg: "Order status updated successfully", order });
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
