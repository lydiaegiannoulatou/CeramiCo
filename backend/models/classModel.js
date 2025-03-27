const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    date: { type: Date, required: true },
    maxSpots: { type: Number, required: true },
    bookedSpots: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
