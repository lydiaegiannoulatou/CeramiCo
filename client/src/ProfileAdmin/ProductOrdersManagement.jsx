import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";

// Helper constants for status and pagination
const statusGroups = ["processing", "shipped", "delivered", "canceled"];
const ordersPerPage = 15;

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:3050/order/product_orders?page=${currentPage}&limit=${ordersPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data?.products || []);
      } catch (err) {
        console.error("Error fetching product orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  // /* ---------------- UPDATE STATUS (used by modal) ---------------- */
  // const updateOrderStatus = async (orderId, value) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     await axios.put(
  //       `http://localhost:3050/order/update/${orderId}`,
  //       { orderStatus: value },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setOrders((prev) =>
  //       prev.map((o) => (o._id === orderId ? { ...o, orderStatus: value } : o))
  //     );
  //     setSelectedOrder((prev) => (prev?._id === orderId ? { ...prev, orderStatus: value } : prev));
  //   } catch (err) {
  //     console.error("Error updating orderStatus:", err);
  //   }
  // };

  /* ---------------- HELPERS ---------------- */
  const grouped = statusGroups.reduce((acc, st) => {
    acc[st] = orders.filter((o) => o.orderStatus === st);
    return acc;
  }, {});

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

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {loading ? (
        <p>Loading product orders...</p>
      ) : (
        statusGroups.map((status) => {
          const filteredOrders = grouped[status];
          return filteredOrders.length > 0 ? (
            <div key={status} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">
                {status.charAt(0).toUpperCase() + status.slice(1)} Orders
              </h3>
              <ul className="space-y-4">
                {filteredOrders.map((order) => (
                  <li
                    key={order._id}
                    className="bg-white border rounded-xl p-4 shadow-md hover:shadow-lg cursor-pointer flex items-center"
                    onClick={() => setSelectedOrder(order)}
                    style={{ minHeight: "120px" }} // Reduced card height
                  >
                    {/* Image Section (Fixed Size) */}
                    <div className="w-20 h-20 flex-shrink-0 mr-4">
                      {order.items.length > 0 && order.items[0].product_id?.images?.[0] ? (
                        <img
                          src={order.items[0].product_id.images[0]}
                          alt={order.items[0].product_id.title}
                          className="object-cover w-full h-full rounded-lg border"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 border rounded-lg bg-gray-100">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          Order #{String(order.orderNumber).padStart(3, "0")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Total:{" "}
                        <span className="font-semibold">€{order.totalCost.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null;
        })
      )}

      {/* Pagination controls */}
      <div className="flex justify-center mt-6">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg mr-4"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt; Previous
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next &gt;
        </button>
      </div>

      {/* Order Summary Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
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

export default ProductOrders;
