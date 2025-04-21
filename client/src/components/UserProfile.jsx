import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext
import axios from "axios"; // Import axios for making API requests

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Get the current user from the context
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState([]); // State for orders
  // const [bookings, setBookings] = useState([]); // State for bookings
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user data (orders and bookings) on mount or when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage

        // Fetch orders and bookings in parallel using Promise.all
        const [orderRes] = await Promise.all([
          axios.get(`http://localhost:3050/order/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // axios.get(`http://localhost:3050/bookings/user`, {
          //   headers: { Authorization: `Bearer ${token}` },
          // }),
        ]);

        setOrders(orderRes.data.orders || []); // Set orders state
        // setBookings(bookingRes.data.bookings || []); // Set bookings state
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false); // Set loading state to false after data is fetched
      }
    };

    if (user) fetchUserData(); // Fetch data if user exists
  }, [user]); // Depend on user, re-fetch data when user changes

  // Function to render the content based on the active tab
  const renderSection = () => {
    if (loading) return <p>Loading...</p>;

    switch (activeTab) {
      case "info":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">👤 Your Info</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">📦 Your Orders</h2>
            {orders.length === 0 ? (
              <p>You have no orders yet.</p> // Show message if no orders
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white border rounded-xl p-4 mb-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{order._id}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex gap-4 mt-3 overflow-x-auto">
                    {order.items.map((item) => (
                      <div key={item._id} className="w-20 h-20 flex-shrink-0">
                        {item.product_id?.images?.[0] ? (
                          <img
                            src={item.product_id.images[0]}
                            alt={item.product_id.title}
                            className="object-cover rounded-lg w-full h-full border"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 border rounded-lg bg-gray-100">
                            No Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {(order.orderStatus === "processing" || order.paymentStatus === "paid") && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-3 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case "bookings":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">🎨 Your Workshop Bookings</h2>
            {bookings.length === 0 ? (
              <p>You haven't booked any workshops yet.</p> // Show message if no bookings
            ) : (
              <ul className="space-y-4">
                {bookings.map((booking) => (
                  <li
                    key={booking._id}
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

      default:
        return <p>Choose a section from the sidebar</p>;
    }
  };

  // Helper function to get the status color for orders
  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
      case "delivered":
        return "bg-green-100 text-green-700";
      case "canceled":
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3050/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "canceled", paymentStatus: "cancelled" }
            : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Unable to cancel order.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f9f5ef]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#e9dccd] p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#4b3b2a]">User Menu</h2>
        <ul className="space-y-3">
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "info" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            My Info
          </li>
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "orders" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </li>
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "bookings" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            My Workshops
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl p-6 shadow">{renderSection()}</div>
      </main>
    </div>
  );
};

export default UserProfile;
