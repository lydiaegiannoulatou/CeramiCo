const Order = require("../models/orderModel");
const Product = require("../models/productModel")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe init




const createOrder = async (req, res) => {
  const { sessionId } = req.body;

  try {
    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required." });
    }

    // Fetch the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ msg: "Stripe session not found." });
    }

    // Extract necessary details from the session
    const userId = session.metadata.userId; // Assuming userId is stored in metadata
    const items = JSON.parse(session.metadata.items); // Assuming items are stored in metadata
    const shippingAddress = JSON.parse(session.metadata.shippingAddress); // Assuming shippingAddress is stored in metadata

    // Create a new order
    const newOrder = new Order({
      user_id: userId,
      items,
      shippingAddress,
      totalCost: session.amount_total / 100,
      currency: session.currency,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      paymentStatus: "paid",
      orderStatus: "processing",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ msg: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ msg: "Could not create order", error: error.message });
  }
};



// GET A SINGLE ORDER WITH STRIPE SESSION ID FOR SUCCESS PATH
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

      console.log("Order fetched:", order);
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

// GET ORDER BY ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    if (!orderId) {
      return res.status(400).json({ msg: "Order ID is required." });
    }

    const order = await Order.findById(orderId)
      .populate("user_id", "name email")
      .populate("items.product_id", "title images")
      

    if (!order) {
      return res.status(404).json({ msg: "Order not found." });
    }

    if (order.user_id._id.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "You are not authorized to view this order." });
    }

    res.status(200).json({ msg: "Order fetched successfully", order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ msg: "Could not retrieve order by ID", error });
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
    console.log("Received orderId:", orderId);  // Log the orderId from the URL

    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order not found for ID:", orderId);  // Log if order is not found
      return res.status(404).json({ msg: "Order not found" });
    }

    // Log the order details
    console.log("Found order:", order);

    // Ensure the logged-in user owns this order
    if (order.user_id.toString() !== req.user.userId) {
      console.log("Unauthorized access attempt by user:", req.user.userId);  // Log unauthorized user access
      return res.status(403).json({ msg: "You are not authorized to cancel this order." });
    }

    // Log the user ID
    console.log("Logged-in user ID:", req.user.userId);
    console.log("Order user ID:", order.user_id.toString());

    // Only refund if the order is paid
    if (order.paymentStatus === "paid") {
      if (!order.stripePaymentIntentId) {
        console.log("No paymentIntentId found for order:", orderId);  // Log if paymentIntentId is missing
        return res.status(400).json({ msg: "No paymentIntentId found for this order" });
      }

      // Log refund attempt
      console.log("Attempting to refund payment with paymentIntentId:", order.paymentIntentId);

      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });

      order.orderStatus = "canceled";
      order.paymentStatus = "refunded";
      await order.save();

      console.log("Updated order status after refund:", order.orderStatus);
      return res.status(200).json({ msg: "Order refunded successfully", refund });
    } else {
      // Log cancellation process
      console.log("Cancelling order without refund. Updating status...");

      order.orderStatus = "canceled";
      order.paymentStatus = "cancelled";
      await order.save();

      console.log("Updated order status:", order.orderStatus);
      return res.status(200).json({ msg: "Order canceled successfully" });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);  // Log the error details
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
  createOrder,
  productOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
  getOrderById
};
