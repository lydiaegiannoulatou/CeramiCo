import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";


const BookNowButton = ({ workshop, selectedSession }) => {
  const [isBooking, setIsBooking] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Extract the userId from the token if available
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decode the JWT token
      userId = decodedToken.userId; // Assuming your token contains userId
    } catch (err) {
      console.error("Invalid token or decoding error", err);
    }
  }

  const isOutOfStock = selectedSession && selectedSession.bookedSpots >= workshop.maxSpots;

  const handleBookNow = async () => {
    if (!token || role !== "user") {
      toast.info("You need to be logged in as a user to book a workshop.");
      return;
    }

    if (isOutOfStock) {
      toast.warning("This session is fully booked.");
      return;
    }

    setIsBooking(true);

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      setIsBooking(false);
      return;
    }

    try {
      // Prepare the booking data
      const bookingData = {
        workshopId: workshop._id, // The ID of the workshop
        sessionId: selectedSession._id, // The selected session's ID
        userId: userId, // The extracted user ID from the JWT
      };

      const response = await axios.post(
        "http://localhost:3050/bookings/book-now",  // POST request to the booking route
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",  // Ensure the content type is correct
          },
        }
      );

      // Handle the response
      if (response.data.success) {
        toast.success("Your booking is confirmed!");
        // Optionally, you can update the UI to reflect the change in available spots
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error booking workshop:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <button
      onClick={handleBookNow}
      className={`flex items-center justify-center py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ${isBooking || isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isBooking || isOutOfStock}
    >
      {isBooking ? (
        <>
          <FaCheckCircle className="mr-2 animate-spin" />
          Booking...
        </>
      ) : isOutOfStock ? (
        "Fully Booked"
      ) : (
        "Book Now"
      )}
    </button>
  );
};

export default BookNowButton;
