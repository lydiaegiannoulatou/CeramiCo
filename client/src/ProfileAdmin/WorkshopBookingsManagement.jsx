import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingDetailsModal from "../ProfileUser/BookingDetailsModal" // Import the modal component

const WorkshopBookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // State to hold selected booking ID for the modal

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        return setError("User is not authorized for this action");
      }

      try {
        const response = await axios.get("http://localhost:3050/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings",err);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId); // Open the modal and set the bookingId
  };

  const closeModal = () => {
    setSelectedBookingId(null); // Close the modal by resetting the bookingId
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workshop Bookings</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Booking #</th>
            <th className="px-4 py-2 border">User Name</th>
            <th className="px-4 py-2 border">Workshop Title</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Payment Status</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Image</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleBookingClick(booking._id)} // Open modal on click
            >
              <td className="px-4 py-2 border">{String(booking._id).slice(-5)}</td>
              <td className="px-4 py-2 border">{booking.user_id.name}</td>
              <td className="px-4 py-2 border">{booking.workshop_id.title}</td>
              <td className="px-4 py-2 border">{booking.status}</td>
              <td className="px-4 py-2 border">{booking.paymentStatus}</td>
              <td className="px-4 py-2 border">{new Date(booking.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">
                <img
                  src={booking.workshop_id.image}
                  alt={booking.workshop_id.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show the modal if a booking is selected */}
      {selectedBookingId && (
        <BookingDetailsModal
          bookingId={selectedBookingId}
          onClose={closeModal} // Close the modal when the user clicks on the close button
        />
      )}
    </div>
  );
};

export default WorkshopBookingsManagement;
