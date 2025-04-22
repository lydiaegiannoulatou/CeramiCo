const Booking = require("../models/bookingModel");
const Workshop = require("../models/workshopModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel")

// 🟢 Fetch all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "name email")
      .populate("workshop_id", "classTitle sessionDate instructor image");

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
      .populate("workshop_id", "classTitle sessionDate instructor image");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking", details: error.message });
  }
};

// 🟢 Fetch bookings for the logged-in user
const bookingsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user_id: userId })
      .populate("workshop_id", "classTitle sessionDate instructor image");

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user bookings", details: error.message });
  }
};

// 🟢 Handle Book Now (after payment success)
const handleBookNow = async (req, res) => {
  try {
    const { workshopId, userId, sessionId } = req.body;  // Include sessionId in the request body

    // Find the workshop by its ID
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ error: "Workshop not found" });

    // Check if the workshop is fully booked
    if (workshop.bookedSpots >= workshop.maxSpots) {
      return res.status(400).json({ error: "Workshop is fully booked" });
    }

    // Check if the user has already booked the workshop
    const alreadyBooked = await Booking.findOne({ user_id: userId, workshop_id: workshopId });
    if (alreadyBooked) {
      return res.status(400).json({ error: "User already booked this workshop" });
    }

    // Create a new booking with status "pending"
    const booking = new Booking({
      user_id: userId,
      workshop_id: workshopId,
      sessionId: sessionId,  // Save the sessionId in the booking
      date: workshop.sessionDate,
      status: "pending",
      paymentStatus: "pending", // Payment status will be updated later
      image: workshop.image, // Save workshop image URL for later
    });

    await booking.save();

    // Increment the booked spots
    workshop.bookedSpots += 1;
    await workshop.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error booking workshop:", error);
    res.status(500).json({ error: "Booking process failed", details: error.message });
  }
};


const getBookingSuccess = async (req, res) => {
  const { sessionId } = req.params;

  // Log the session ID received in the request
  console.log("Received session ID:", sessionId);

  try {
    // Check if sessionId exists
    if (!sessionId) {
      console.log("No session ID provided.");
      return res.status(400).json({ message: "Session ID is required." });
    }

    // Query the database to find the booking with the matching sessionId
    const booking = await Booking.findOne({ sessionId: sessionId })
      .populate("user_id", "name email")
      .populate("workshop_id", "title description image");

    // Log the fetched booking or error if not found
    if (!booking) {
      console.log("Booking not found for session ID:", sessionId);
      return res.status(404).json({ message: "Booking not found." });
    } else {
      console.log("Booking found:", booking);
    }

    // If booking is found, send the details as a response
    res.status(200).json({
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
    // Log the error if there's a problem fetching the booking
    console.error("Error fetching booking:", err);

    // Return a 500 error if something goes wrong
    res.status(500).json({ message: "Could not retrieve booking details." });
  }
};



module.exports = {
  getAllBookings,
  getBookingById,
  bookingsByUser,
  handleBookNow,
  getBookingSuccess
};
