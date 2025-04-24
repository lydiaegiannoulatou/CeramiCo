import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import OrderDetailsModal from "../ProfileUser/OrderDetailsModal";

const statusGroups = ["all", "processing", "shipped", "delivered", "canceled"];
const ordersPerPage = 15;

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(statusGroups[0]);

  /* ───────── Fetch orders ───────── */
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `http://localhost:3050/order/product_orders?page=${currentPage}&limit=${ordersPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data?.products || []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch product orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  /* ───────── Helpers ───────── */
  const getStatusColor = (st) => {
    switch (st) {
      case "processing": return "bg-yellow-100 text-yellow-700";
      case "shipped":
      case "delivered": return "bg-green-100 text-green-700";
      case "canceled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Count the orders for each status, including "all"
  const statusCounts = useMemo(() => {
    return statusGroups.reduce((acc, st) => {
      if (st === "all") {
        acc[st] = orders.length; // Count all orders
      } else {
        acc[st] = orders.filter((o) => o.orderStatus === st).length; // Count based on status
      }
      return acc;
    }, {});
  }, [orders]);

  // Filter orders based on the selected status
  const visibleOrders = statusFilter === "all"
    ? orders // Show all orders if "All" is selected
    : orders.filter((o) => o.orderStatus === statusFilter);

  // Calculate total pages for the filtered list
  const totalPages = Math.max(1, Math.ceil(statusCounts[statusFilter] / ordersPerPage));
  const disableNext = currentPage >= totalPages;
  const disablePrev = currentPage <= 1;

  /* ───────── Render ───────── */
  if (loading) return <p className="p-4">Loading product orders…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Product Orders</h2>

      {/* Filter Pills */}
      <div className="inline-flex rounded-full overflow-hidden mb-6 border">
        {statusGroups.map((st, idx) => (
          <button
            key={st}
            onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
            className={`px-5 py-1 text-sm capitalize flex items-center gap-1
              ${statusFilter === st
              ? "text-white"
              : "text-gray-700 hover:bg-gray-200"
              }
              ${idx === 0 ? "" : "border-l"}  /* divider */
            `}
            style={{
              backgroundColor: statusFilter === st ? "#D36B3C" : "transparent"
            }}
          >
            {st} <span className="font-semibold">({statusCounts[st]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border">Order #</th>
            <th className="px-4 py-2 border">Product Title</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Total (€)</th>
            <th className="px-4 py-2 border">Payment Status</th>
            <th className="px-4 py-2 border">Order Status</th>
          </tr>
        </thead>
        <tbody>
          {visibleOrders.map((o) => (
            <tr
              key={o._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedOrder(o)} // Select order to view details
            >
              <td className="px-4 py-2 border">{String(o.orderNumber).padStart(3, "0")}</td>
              <td className="px-4 py-2 border">{o.items[0]?.product_id?.title || "—"}</td>
              <td className="px-4 py-2 border">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">{o.totalCost.toFixed(2)}</td>
              <td className="px-4 py-2 border">{o.paymentStatus}</td>
              <td className="px-4 py-2 border">
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(o.orderStatus)}`}>
                  {o.orderStatus}
                </span>
              </td>
            </tr>
          ))}
          {visibleOrders.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No {statusFilter} orders
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          disabled={disablePrev}
          className={`px-4 py-2 rounded-lg ${disablePrev ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt; Previous
        </button>
        <button
          disabled={disableNext}
          className={`px-4 py-2 rounded-lg ${disableNext ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next &gt;
        </button>
      </div>

      {/* Order Summary Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside it
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &#x2715;
            </button>
            {/* Render the OrderSummary component */}
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOrders;
