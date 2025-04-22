import React, { useState, useEffect } from "react";
import axios from "axios";

const UserBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token")
      console.log("token", token);
      
      try {
        const response = await axios.get("http://localhost:3050/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🎨 Your Workshop Bookings</h2>
      {bookings.length === 0 ? (
        <p>You haven't booked any workshops yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id} // Make sure you have a unique key
              className="border bg-white rounded-xl p-4 shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{booking.class_id.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.class_id.date).toLocaleDateString()} | Status:{" "}
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
    </div>
  );
};

export default UserBookings;
