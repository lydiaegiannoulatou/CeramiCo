const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], required: true },
    stock: { type: Number, required: true },
    images: { type: [String], default: [] },
    stripeProductId: { type: String, default: null },
    stripePriceId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
