import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3050/order/all_orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders); // Set the orders data
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle updating order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Assuming you have a function to get the admin's token
      const token = localStorage.getItem("token");

      // Make the PUT request to update the order status
      const response = await axios.put(
        `/order/update/${orderId}`,
        { orderStatus: newStatus }, // Send the new status
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        }
       
        
      );
      console.log("Response",response)
      // Update the order status locally after a successful update
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return <p>Loading all orders for review...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* All Orders */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.paymentStatus}</td>
                <td className="border p-2">{order.orderStatus}</td>
                <td className="border p-2">
                  {/* Dropdown or buttons to update order status */}
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleUpdateStatus(order._id, "shipped")}
                  >
                    Mark as Shipped
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdateStatus(order._id, "canceled")}
                  >
                    Cancel Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Newsletter */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Send Newsletter</h3>
        <textarea
          rows="4"
          className="w-full border p-2 rounded"
          placeholder="Write your message here..."
        ></textarea>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Send to Subscribers
        </button>
      </div>
    </div>
  );
};

export default OrderPage;