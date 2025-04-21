const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['product', 'workshop'], // Restrict to valid types
    default: 'product', // Default to 'product' if not specified
  },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  workshop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
