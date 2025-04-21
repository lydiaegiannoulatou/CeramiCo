const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  bookingsByUser
} = require("../controllers/bookingController");
const{authMiddleware, adminAccess}= require("../middleware/authMiddleware")

router.get("/",authMiddleware,adminAccess,getAllBookings)
router.get("/:id",authMiddleware,getBookingById)
router.get("/user", authMiddleware, bookingsByUser)
router.post("new_booking",authMiddleware,createBooking)
router.put("update/:id",authMiddleware,updateBooking)
router.delete("delete/:id",authMiddleware,deleteBooking)

module.exports = router;
