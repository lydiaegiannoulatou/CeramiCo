const Booking = require("../models/bookingModel");
const Workshop = require("../models/WorkshopModel"); // Update this import

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user_id) filter.user_id = req.query.user_id;

    const bookings = await Booking.find(filter)
      .populate("user_id", "name email") // Optional: populate user info
      .populate("workshop_id", "title date instructor"); // Populate workshop info (was "class" before)

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
  }
};

// Get a booking with id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("workshop_id", "title date");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking", details: error.message });
  }
};

// Add new booking (admin)
const createBooking = async (req, res) => {
  try {
    const { user_id, workshop_id } = req.body; // Update to use workshop_id

    const selectedWorkshop = await Workshop.findById(workshop_id); // Update to search Workshop model
    if (!selectedWorkshop) return res.status(404).json({ error: "Workshop not found" });

    if (selectedWorkshop.bookedSpots >= selectedWorkshop.maxSpots) {
      return res.status(400).json({ error: "Workshop is fully booked" });
    }

    const existingBooking = await Booking.findOne({ user_id, workshop_id }); // Use workshop_id here
    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked this workshop" });
    }

    const newBooking = new Booking({
      user_id,
      workshop_id, // Updated to store workshop_id
      date: selectedWorkshop.date, // Use workshop date as booking date
    });

    await newBooking.save();

    selectedWorkshop.bookedSpots += 1;
    await selectedWorkshop.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking", details: error.message });
  }
};

// Get bookings made by the logged-in user
const bookingsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Extract the user ID from the JWT token
    const bookings = await Booking.find({ user_id: userId }) // Find bookings by the user ID
      .populate("workshop_id", "title date instructor"); // Populate workshop details (was "class" before)

    // If no bookings are found, return an empty array
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ bookings: [] }); // Respond with empty array if no bookings
    }

    res.status(200).json({ bookings }); // Respond with the bookings if found
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" }); // Respond with an error if something goes wrong
  }
};

// Update booking (admin)
const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking", details: error.message });
  }
};

// Delete booking (admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Decrease the booked spots on workshop
    const bookedWorkshop = await Workshop.findById(booking.workshop_id); // Use Workshop model
    if (bookedWorkshop && bookedWorkshop.bookedSpots > 0) {
      bookedWorkshop.bookedSpots -= 1;
      await bookedWorkshop.save();
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking", details: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  bookingsByUser,
};
