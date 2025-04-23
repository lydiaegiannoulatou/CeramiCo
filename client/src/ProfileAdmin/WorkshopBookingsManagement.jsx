import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingsManagement = () => {
  const [workshopOrders, setWorkshopOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all workshop orders
  useEffect(() => {
    const fetchWorkshopOrders = async () => {
      try {
        // Get token and role from localStorage
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
console.log("Token:", token,"Role:", role);

        // Check if user is admin
        if (role !== "admin") {
          setError("You do not have the necessary permissions to view this page.");
          return;
        }

        // Make the API request to fetch workshop orders
        const response = await axios.get("http://localhost:3050/order/workshop_orders", {
          headers: {
            Authorization: `Bearer ${token}`, // Use token for authentication
          },
        });

        setWorkshopOrders(response.data.orders);
      } catch (err) {
        setError("Failed to fetch workshop orders.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopOrders();
  }, []);

  // Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3050/order/update/${orderId}`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkshopOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update the order status.", err);
    }
  };


  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3050/order/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkshopOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err) {
      setError("Failed to cancel the order.", err);
    }
  };

  // Handle selecting an order for detailed view
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  if (loading) {
    return <div>Loading workshop orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Manage Workshop Bookings</h1>

      {/* List of workshop orders */}
      <div className="space-y-4">
        {workshopOrders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-lg shadow-md"
            onClick={() => handleSelectOrder(order)}
          >
            <h3 className="text-lg font-semibold">{order.items[0]?.classTitle}</h3>
            <p>Customer: {order.shippingAddress.fullName}</p>
            <p>Session Date: {new Date(order.items[0]?.sessionDate).toLocaleDateString()}</p>
            <p>Order Status: {order.orderStatus}</p>
            <p>Payment Status: {order.paymentStatus}</p>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleStatusChange(order._id, "shipped")}
              >
                Mark as Shipped
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => handleStatusChange(order._id, "delivered")}
              >
                Mark as Delivered
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details (if an order is selected) */}
      {selectedOrder && (
        <div className="mt-8 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <p>
            <strong>Customer Name:</strong> {selectedOrder.shippingAddress.fullName}
          </p>
          <p>
            <strong>Session Date:</strong> {new Date(selectedOrder.items[0]?.sessionDate).toLocaleString()}
          </p>
          <p>
            <strong>Class Title:</strong> {selectedOrder.items[0]?.classTitle}
          </p>
          <p>
            <strong>Order Status:</strong> {selectedOrder.orderStatus}
          </p>
          <p>
            <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
          </p>
          <div className="flex space-x-2 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleStatusChange(selectedOrder._id, "shipped")}
            >
              Mark as Shipped
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => handleStatusChange(selectedOrder._id, "delivered")}
            >
              Mark as Delivered
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleCancelOrder(selectedOrder._id)}
            >
              Cancel Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
