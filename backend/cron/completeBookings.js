const cron    = require("node-cron");
const Booking = require("../models/bookingModel");

cron.schedule("0 2 * * *", async () => {      // every night at 02:00
  const now = new Date();
  console.log('Cron job is running...')
  await Booking.updateMany(
    { date: { $lt: now }, status: { $nin: ["canceled", "completed"] } },
    { status: "completed" }
  );

  console.log("[cron] Past-date bookings marked completed");
});
