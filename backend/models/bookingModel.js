const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    workshop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true }, 
    sessionId: { type: String, required: true }, 
    date: { type: Date, required: true, default: Date.now }, // Defaults to current date
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    image: { type: String, required: true }, 
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
