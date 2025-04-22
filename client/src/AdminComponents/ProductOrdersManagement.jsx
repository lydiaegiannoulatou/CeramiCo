import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";


const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3050/order/product_orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          console.error("No orders found in the response:", response.data);
          setOrders([]); // Set empty orders to prevent further issues
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);  
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateField = async (orderId, field, value) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3050/order/update/${orderId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, [field]: value } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  if (loading) return <p>Loading all orders for review...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Order Number</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total Cost</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td
                    className="border p-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {order.orderNumber
                      ? order.orderNumber.toString().padStart(3, "0")
                      : order._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="border p-2">{order.items.length} items</td>
                  <td className="border p-2">
                    €{(order.totalCost).toFixed(2)}{" "}
                    {order.currency || "EUR"}
                  </td>
                  <td className="border p-2">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handleUpdateField(order._id, "paymentStatus", e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateField(order._id, "orderStatus", e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="border p-2 text-sm text-gray-600">
                    Last updated: {new Date(order.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              &#x2715;
            </button>
            <OrderSummary order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap your component in an ErrorBoundary
const AdminOrderPageWithErrorBoundary = () => (
  <ErrorBoundary>
    <AdminOrderPage />
  </ErrorBoundary>
);

export default AdminOrderPageWithErrorBoundary;
