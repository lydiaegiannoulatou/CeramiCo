import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailsModal from "./OrderDetailsModal";

const UserOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/order/user`, {
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

  // Group orders by status
  const processing = orders.filter(
    (order) => order.orderStatus === "processing"
  );
  const shipped = orders.filter((order) => order.orderStatus === "shipped");
  const delivered = orders.filter((order) => order.orderStatus === "delivered");
  const canceled = orders.filter((order) => order.orderStatus === "canceled");

  const renderOrderList = (list) =>
    list.map((order) => (
      <div
        key={order._id}
        className="bg-white border rounded-xl p-4 shadow-md cursor-pointer hover:bg-gray-50"
        onClick={() => setSelectedOrder(order)}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">
            Order #{String(order.orderNumber).padStart(3, "0")}
          </span>
          <span
            className={`text-sm px-2 py-1 rounded-full ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          Total:{" "}
          <span className="font-semibold">€{order.totalCost.toFixed(2)}</span>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto">
          {order.items.map((item, index) => (
            <div
              key={`${item._id || index}`}
              className="w-20 h-20 flex-shrink-0"
            >
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
    ));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📦 Your Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <>
          {processing.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Processing Orders
              </h3>
              <div className="space-y-4">{renderOrderList(processing)}</div>
            </>
          )}

          {shipped.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                Shipped Orders
              </h3>
              <div className="space-y-4">{renderOrderList(shipped)}</div>
            </>
          )}

          {delivered.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                Delivered Orders
              </h3>
              <div className="space-y-4">{renderOrderList(delivered)}</div>
            </>
          )}

          {canceled.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                Canceled Orders
              </h3>
              <div className="space-y-4">{renderOrderList(canceled)}</div>
            </>
          )}
        </>
      )}
      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative p-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            {/* Scrollable Modal Content */}
            <div className="modal-content max-h-[80vh] overflow-y-auto">
              <OrderDetailsModal order={selectedOrder} />
            </div>
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
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default UserOrders;
