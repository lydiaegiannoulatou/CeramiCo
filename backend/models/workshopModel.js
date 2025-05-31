const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    instructor: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    recurringTime: { type: String, required: true },
    maxSpots: { type: Number, required: true },
    sessions: [
      {
        sessionDate: { type: Date, required: true },
        bookedSpots: { type: Number, default: 0 },  // Added to track booked spots for each session
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;
