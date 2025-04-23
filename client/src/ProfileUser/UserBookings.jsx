import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingDetailsModal from "./BookingDetailsModal";
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
        console.log("Bookings fetched for profile:", response.data.bookings);
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  
  // Split bookings by status
  const upcoming = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "canceled"
  );
  const completed = bookings.filter((b) => b.status === "completed");
  const canceled = bookings.filter((b) => b.status === "canceled");

  const renderBookingList = (list) =>
    list.map((booking) => (
      <li
        key={booking._id}
        onClick={() => setSelectedBooking(booking._id)}
        className="border bg-white rounded-xl p-4 shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
      >
        {/* Image thumbnail */}
        {booking.workshop_id.image && (
          <img
            src={booking.workshop_id.image}
            alt={booking.workshop_id.title}
            className="w-16 h-16 rounded-md object-cover mr-4"
          />
        )}

        {/* Text content */}
        <div className="flex-1">
          <p className="font-medium">{booking.workshop_id.title}</p>
          <p className="text-sm text-gray-600">
            {new Date(booking.date).toLocaleDateString()} | Status:{" "}
            {booking.status}
          </p>
        </div>

        {/* Payment status */}
        <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded">
          {booking.paymentStatus}
        </span>
      </li>
    ));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🎨 Your Workshop Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You haven't booked any workshops yet.</p>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Upcoming Workshops
              </h3>
              <ul className="space-y-4">{renderBookingList(upcoming)}</ul>
            </>
          )}

          {completed.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                ✅ Past Workshops
              </h3>
              <ul className="space-y-4">{renderBookingList(completed)}</ul>
            </>
          )}

          {canceled.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                ❌ Canceled Workshops
              </h3>
              <ul className="space-y-4">{renderBookingList(canceled)}</ul>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default UserBookings;
