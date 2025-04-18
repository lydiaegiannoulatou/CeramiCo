const Booking = require("../models/bookingModel");
const Class = require("../models/classModel");

//Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user_id) filter.user_id = req.query.user_id;

    const bookings = await Booking.find(filter)
      .populate("user_id", "name email") // Optional: populate user info
      .populate("class_id", "title date instructor"); // Optional: populate class info

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
  }
};

//get a booking with id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("class_id", "title date");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking", details: error.message });
  }
};

//add new booking (admin)
const createBooking = async (req, res) => {
  try {
    const { user_id, class_id } = req.body;

    const selectedClass = await Class.findById(class_id);
    if (!selectedClass) return res.status(404).json({ error: "Class not found" });

    if (selectedClass.bookedSpots >= selectedClass.maxSpots) {
      return res.status(400).json({ error: "Class is fully booked" });
    }

    const existingBooking = await Booking.findOne({ user_id, class_id });
    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked this class" });
    }

    const newBooking = new Booking({
      user_id,
      class_id,
      date: selectedClass.date, // Use class date as booking date
    });

    await newBooking.save();

    selectedClass.bookedSpots += 1;
    await selectedClass.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking", details: error.message });
  }
};

//update booking(admin)
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

//delete booking(admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Decrease the booked spots on class
    const bookedClass = await Class.findById(booking.class_id);
    if (bookedClass && bookedClass.bookedSpots > 0) {
      bookedClass.bookedSpots -= 1;
      await bookedClass.save();
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
};
