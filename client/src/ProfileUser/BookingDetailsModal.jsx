import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import ToastNotification from '../components/ToastNotification';

const BookingDetailsModal = ({ bookingId, onClose, onStatusChange }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
const baseUrl = import.meta.env.VITE_BASE_URL;
  
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = () => {
    // Ask for confirmation using the ToastNotification helper
    ToastNotification.notifyWarning(
      "Are you sure you want to cancel this booking?",
      {
        onConfirm: confirmCancel,
      }
    );
  };

  const confirmCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/bookings/cancel/${booking._id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastNotification.notifySuccess("Booking canceled successfully.");

      // Inform parent so list refreshes (if prop provided)
      if (onStatusChange) {
        onStatusChange("canceled");
      }
      onClose();
    } catch (err) {
      console.error(err);
      ToastNotification.notifyError("Failed to cancel booking");
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

            {/* Conditionally render Cancel Booking button */}
            {booking.status === "confirmed" && (
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </button>
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
