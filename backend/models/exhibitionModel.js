const mongoose = require("mongoose");

const exhibitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    media: {
      type: [String], // Array of image or video URLs
      required: true,
    },

    description: { type: String, required: true },

    participants: [
      {
        name: { type: String, required: true },
        bio: { type: String },
        profileImage: { type: String },
        role: { type: String }, // e.g. "Artist", "Curator"
      },
    ],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    location: { type: String }, // optional if it's online

    tags: [String], // e.g. ["ceramics", "group show"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibition", exhibitionSchema);
