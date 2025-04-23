const Booking = require("../models/bookingModel");
const Workshop = require("../models/workshopModel");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 🟢 Fetch all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "name email")
      .populate("workshop_id", "title sessions instructor image");
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
  }
};

// 🟢 Fetch single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("workshop_id", "title sessions instructor image");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking", details: error.message });
  }
};

// 🟢 Fetch bookings for the logged-in user
const bookingsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate("workshop_id", "title instructor image sessions");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user bookings", details: error.message });
  }
};

// 🟢 Handle Book Now (after payment success)
const handleBookNow = async (req, res) => {
  try {
    const { workshopId, userId, sessionId, stripeSessionId, paymentIntentId } = req.body;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });

    const session = workshop.sessions.id(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    if (session.bookedSpots >= session.maxSpots) {
      return res.status(400).json({ error: "This session is fully booked" });
    }

    const alreadyBooked = await Booking.findOne({
      user_id: userId,
      workshop_id: workshopId,
      date: session.date, // Optional: avoid duplicate bookings by date
    });

    if (alreadyBooked) {
      return res.status(400).json({ error: "User already booked this workshop session" });
    }

    const booking = new Booking({
      user_id: userId,
      workshop_id: workshopId,
      stripeSessionId,
      paymentIntentId,
      date: session.date,
      status: "confirmed",
      paymentStatus: "paid",
      image: workshop.image,
    });

    await booking.save();

    session.bookedSpots += 1;
    await workshop.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error booking workshop:", error);
    res.status(500).json({ error: "Booking process failed", details: error.message });
  }
};

// 🟢 Get booking after successful payment
const getBookingSuccess = async (req, res) => {
  const { sessionId } = req.params;

  try {
    if (!sessionId) return res.status(400).json({ message: "Session ID is required." });

    const booking = await Booking.findOne({ stripeSessionId: sessionId })
      .populate("user_id", "name email")
      .populate("workshop_id", "title description instructor image");

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    res.status(200).json({
      _id: booking._id,
      workshopTitle: booking.workshop_id.title,
      workshopImage: booking.workshop_id.image,
      sessionDate: booking.date,
      status: booking.status,
      bookingDate: booking.createdAt,
      user: {
        name: booking.user_id.name,
        email: booking.user_id.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Could not retrieve booking details." });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking   = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "canceled")
      return res.status(400).json({ message: "Booking is already canceled." });

    // 1. mark booking canceled
    booking.status = "canceled";

    // 2. free the workshop spot
    const workshop = await Workshop.findById(booking.workshop_id);
    if (workshop?.sessions?.length) {
      const session = workshop.sessions.find(
        (s) => new Date(s.sessionDate).getTime() === new Date(booking.date).getTime()
      );

      if (session && session.bookedSpots > 0) {
        session.bookedSpots -= 1;
        await workshop.save();
      }
    }

    // 3. refund if necessary
    if (booking.paymentStatus === "paid" && booking.paymentIntentId) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: booking.paymentIntentId,
        });
        console.log("Refund successful:", refund.id);
        booking.paymentStatus = "refunded";
      } catch (err) {
        console.error("Refund failed:", err.message);
        return res.status(500).json({ error: "Failed to issue refund", details: err.message });
      }
    }

    await booking.save();
    res.status(200).json({ message: "Booking canceled and refunded (if paid)." });

  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking", details: err.message });
  }
};


module.exports = {
  getAllBookings,
  getBookingById,
  bookingsByUser,
  handleBookNow,
  getBookingSuccess,
  cancelBooking,
};
