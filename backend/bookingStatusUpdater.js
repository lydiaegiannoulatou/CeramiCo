const cron = require("node-cron");
const Booking = require('./models/bookingModel')
const connectToDB = require('./config/connection')   
const mongoose = require("mongoose");

// Connect to MongoDB first
connectToDB().then(() => {
  console.log("📡 MongoDB connected. Starting scheduled booking status check...");

  // Schedule the task to run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      // Find bookings in the past that are still pending or confirmed
      const result = await Booking.updateMany(
        {
          date: { $lt: now },
          status: { $in: ["pending", "confirmed"] },
        },
        { $set: { status: "completed" } }
      );

      console.log(`✅ ${result.modifiedCount} bookings marked as completed at ${now.toISOString()}`);
    } catch (error) {
      console.error("❌ Error updating booking statuses:", error.message);
    }
  });
}).catch((err) => {
  console.error("❌ Could not connect to database:", err.message);
});
