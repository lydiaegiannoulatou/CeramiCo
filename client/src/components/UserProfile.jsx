import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3050/order/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3050/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: 'canceled', paymentStatus: 'cancelled' }
            : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Unable to cancel order.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'canceled':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Your Profile</h1>

      <h2 className="text-2xl font-semibold mb-4">📦 Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white border rounded-xl p-4 mb-4 shadow-md">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-blue-600 font-medium hover:underline"
              >
                🧾 Order ID: {order._id}
              </button>
              <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="flex gap-4 mt-3 overflow-x-auto">
              {order.items.map(item => (
                <div key={item.product_id?._id || item._id} className="w-20 h-20 flex-shrink-0">
                  {item.product_id?.images?.[0] ? (
                    <img
                      src={item.product_id.images[0]}
                      alt={item.product_id.title || 'Product image'}
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

            {(order.orderStatus === 'processing' || order.paymentStatus === 'paid') && (
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

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
            <p><strong>Total Items:</strong> {selectedOrder.items.length}</p>

            <div className="mt-4 space-y-3">
              {selectedOrder.items.map(item => (
                <div key={item.product_id._id} className="flex items-center gap-3 border-b pb-2">
                  <img
                    src={item.product_id.images[0]}
                    alt={item.product_id.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product_id.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-800">Price: ${item.product_id.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
