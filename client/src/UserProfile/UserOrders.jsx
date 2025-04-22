import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";

const UserOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3050/order/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-4 mb-4 shadow-md cursor-pointer"
            onClick={() => handleOrderClick(order)}
          >
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
          </div>
        ))
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative p-6">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <OrderSummary order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

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

export default UserOrders;
