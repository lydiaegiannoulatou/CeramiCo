import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingSummary from "../components/BookingSummary";
import { FaTimes } from "react-icons/fa";

const UserBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:3050/bookings/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const closeModal = () => setSelectedBooking(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🎨 Your Workshop Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You haven't booked any workshops yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              onClick={() => setSelectedBooking(booking)}
              className="border bg-white rounded-xl p-4 shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{booking.workshop_id.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} | Status:{" "}
                  {booking.status}
                </p>
              </div>
              <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded">
                {booking.paymentStatus}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              <FaTimes />{" "}
            </button>
            <BookingSummary
              booking={{
                workshopTitle: selectedBooking.workshop_id.title,
                workshopImage: selectedBooking.workshop_id.image,
                sessionDate: selectedBooking.date,
                status: selectedBooking.status,
                bookingDate: selectedBooking.createdAt,
                user: selectedBooking.user_id,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
