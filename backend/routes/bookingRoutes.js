const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  bookingsByUser,
   getBookingSuccess,
  cancelBooking, 
  updateBookingStatus,
} = require("../controllers/bookingController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

// Create a new booking
router.get("/user", authMiddleware, bookingsByUser); 
router.get("/", authMiddleware, adminAccess, getAllBookings);
router.get("/:id", authMiddleware, getBookingById);
router.get("/success/:sessionId", authMiddleware, getBookingSuccess);
router.put("/cancel/:id", authMiddleware, cancelBooking);
router.patch("/bookings/:id", updateBookingStatus);

module.exports = router;