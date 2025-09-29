import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import OrderDetailsModal from "../ProfileUser/OrderDetailsModal";
import { Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Menu } from "lucide-react";

const statusGroups = ["all", "processing", "shipped", "delivered", "canceled"];
const ordersPerPage = 15;

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(statusGroups[0]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch all product orders once, no pagination params
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `${baseUrl}/order/product_orders`,
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
  }, []);

  const getStatusColor = (st) => {
    switch (st) {
      case "processing": return "bg-[#F5F2EB] text-[#D36B3C]";
      case "shipped": return "bg-[#EDF7ED] text-[#2F4138]";
      case "delivered": return "bg-[#E8F4F2] text-[#2D6A6E]";
      case "canceled": return "bg-[#FBEAEA] text-[#D32F2F]";
      default: return "bg-[#F5F2EB] text-[#2F4138]";
    }
  };

  // Count how many orders per status
  const statusCounts = useMemo(() => {
    return statusGroups.reduce((acc, st) => {
      if (st === "all") {
        acc[st] = orders.length;
      } else {
        acc[st] = orders.filter((o) => o.orderStatus === st).length;
      }
      return acc;
    }, {});
  }, [orders]);

  // Filter orders based on statusFilter
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  // Pagination logic: calculate total pages & slice visible orders
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const visibleOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage]);

  const disableNext = currentPage >= totalPages;
  const disablePrev = currentPage <= 1;

  const FilterTabBtn = ({ status }) => (
    <button
      onClick={() => {
        setStatusFilter(status);
        setCurrentPage(1);
        setShowMobileFilters(false);
      }}
      className={`w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between sm:justify-center space-x-2
        ${statusFilter === status
          ? "bg-[#2F4138] text-white"
          : "bg-[#2F4138]/5 text-[#2F4138] hover:bg-[#2F4138]/10"
        }`}
    >
      <span className="capitalize">{status}</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
        {statusCounts[status]}
      </span>
    </button>
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/order/update/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 p-4">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-sm sm:text-base">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center space-y-3 sm:space-y-4 p-4">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-base sm:text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Filter Section */}
      <div className="space-y-3 sm:space-y-0">
        {/* Desktop Filters */}
        <div className="hidden sm:flex items-center space-x-4">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F4138] flex-shrink-0" />
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {statusGroups.map((status) => (
              <FilterTabBtn key={status} status={status} />
            ))}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#2F4138]/5 rounded-lg text-[#2F4138] hover:bg-[#2F4138]/10 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                Filter: <span className="capitalize">{statusFilter}</span>
              </span>
            </div>
            <Menu className={`w-4 h-4 transition-transform duration-200 ${showMobileFilters ? 'rotate-90' : ''}`} />
          </button>

          {/* Mobile Filter Dropdown */}
          {showMobileFilters && (
            <div className="mt-2 space-y-2 p-3 bg-white rounded-lg border border-[#2F4138]/10">
              {statusGroups.map((status) => (
                <FilterTabBtn key={status} status={status} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-[#2F4138]/10">
        {/* Mobile Card View */}
        <div className="sm:hidden">
          {visibleOrders.map((o) => (
            <div
              key={o._id}
              onClick={() => setSelectedOrder(o)}
              className="p-4 border-b border-[#2F4138]/10 last:border-b-0 hover:bg-[#2F4138]/5 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-[#2F4138]">
                    Order #{String(o.orderNumber).padStart(3, "0")}
                  </p>
                  <p className="text-xs text-[#2F4138]/70 mt-1">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(o.orderStatus)}`}>
                  {o.orderStatus}
                </span>
              </div>
              <p className="text-sm text-[#2F4138] mb-2 truncate">
                {o.items[0]?.product_id?.title || "—"}
              </p>
              <div className="flex justify-between items-center text-xs text-[#2F4138]/70">
                <span>€{o.totalCost.toFixed(2)}</span>
                <span>{o.paymentStatus}</span>
              </div>
            </div>
          ))}
          
          {visibleOrders.length === 0 && (
            <div className="p-6 text-center text-[#2F4138]/70">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2F4138]/5">
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Order #</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Product Title</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Date</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Total (€)</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Payment Status</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4138]/10">
              {visibleOrders.map((o) => (
                <tr
                  key={o._id}
                  onClick={() => setSelectedOrder(o)}
                  className="hover:bg-[#2F4138]/5 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">
                    {String(o.orderNumber).padStart(3, "0")}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138] max-w-xs truncate">
                    {o.items[0]?.product_id?.title || "—"}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">
                    {o.totalCost.toFixed(2)}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">
                    {o.paymentStatus}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 lg:px-6 py-6 lg:py-8 text-center text-[#2F4138]/70">
                    <Package className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm lg:text-base">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          disabled={disablePrev}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm ${
            disablePrev
              ? "bg-[#2F4138]/5 text-[#2F4138]/40 cursor-not-allowed"
              : "bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20"
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          Previous
        </button>

        <span className="text-xs sm:text-sm text-[#2F4138] font-medium px-4 py-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={disableNext}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm ${
            disableNext
              ? "bg-[#2F4138]/5 text-[#2F4138]/40 cursor-not-allowed"
              : "bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </button>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <OrderDetailsModal 
              order={selectedOrder} 
              onClose={() => setSelectedOrder(null)} 
              onStatusChange={handleStatusChange} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOrders;