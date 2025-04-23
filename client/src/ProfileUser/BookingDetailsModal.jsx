import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const BookingDetailsModal = ({ bookingId, onClose }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch booking data
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3050/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooking(response.data);
        setStatus(response.data.status); // Initialize status with the current booking status
        const role = localStorage.getItem("role");
        setIsAdmin(role === "admin"); // Set the user role to admin if available
      } catch (err) {
        console.error("Error fetching booking details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return; // Only admins can change status

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3050/bookings/update-status/${booking._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus); // Update the UI with the new status
      alert("Booking status updated successfully.");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update booking status.");
    }
  };

  const handleCancelBooking = async () => {
    if (!isAdmin) return; // Only admins can cancel bookings

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3050/bookings/cancel/${booking._id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking canceled successfully.");
      window.location.reload(); // Refresh the page or re-fetch data
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  if (!bookingId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          <FaTimes />
        </button>

        {loading ? (
          <p className="text-center">Loading booking details...</p>
        ) : booking ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Booking Details
            </h2>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Workshop</h3>
              <p className="text-lg font-medium">{booking.workshop_id.title}</p>
              <img
                src={booking.workshop_id.image}
                alt="Workshop"
                className="mt-2 rounded-lg w-full h-64 object-cover shadow"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Session Info
              </h3>
              <p>
                <strong>Date:</strong> {new Date(booking.date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Payment:</strong> {booking.paymentStatus}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">User Info</h3>
              <p>
                <strong>Name:</strong> {booking.user_id.name}
              </p>
              <p>
                <strong>Email:</strong> {booking.user_id.email}
              </p>
            </div>

            {isAdmin && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700">Admin Actions</h3>

                {/* Status Change */}
                <div className="mb-4">
                  <label className="text-sm text-gray-600">Update Status:</label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="mt-2 p-2 border rounded-md w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                {/* Cancel Booking */}
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleCancelBooking}
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Booking not found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsModal;
