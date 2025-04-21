const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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

const orderItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["product", "workshop"],
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Corrected: Matches the model name in productModel.js
      required: function () {
        return this.type === "product"; // Only required if type is "product"
      },
    },
    workshop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: function () {
        return this.type === "workshop"; // Only required if type is "workshop"
      },
    },
    quantity: {
      type: Number,
      required: function () {
        return this.type === "product"; // Only required if type is "product"
      },
    },
    price: { type: Number, required: true }, // In cents

    // Workshop-specific fields
    sessionDate: { type: Date },
    classTitle: { type: String },
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
    items: [orderItemSchema],

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
      enum: ["pending", "paid", "cancelled", "refunded"],
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
    orderNumber: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(AutoIncrement, { inc_field: "orderNumber", start_seq: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
