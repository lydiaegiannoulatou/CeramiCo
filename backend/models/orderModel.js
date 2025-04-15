const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // In cents
      },
    ],
    totalCost: {
      type: Number,
      required: true, // In cents
    },
    currency: {
      type: String,
      default: "EUR",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled", "refunded"],
      default: "pending",
    },
    paymentIntentId: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "canceled"],
      default: "processing",
    },
    shippingAddress: shippingAddressSchema,

    // Stripe-specific fields
    stripeSessionId: {
      type: String,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
