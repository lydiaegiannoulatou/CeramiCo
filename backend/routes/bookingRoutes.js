const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  bookingsByUser,
  handleBookNow,
  getBookingSuccess
} = require("../controllers/bookingController");
const { authMiddleware, adminAccess } = require("../middleware/authMiddleware");

// Create a new booking
router.get("/user", authMiddleware, bookingsByUser); 
router.get("/", authMiddleware, adminAccess, getAllBookings);
router.get("/:id", authMiddleware, getBookingById);
router.post("/book-now", authMiddleware, handleBookNow);
router.get("/success/:sessionId", authMiddleware, getBookingSuccess);

module.exports = router;
