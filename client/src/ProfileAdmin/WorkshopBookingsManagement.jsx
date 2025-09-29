import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingDetailsModal from "../ProfileUser/BookingDetailsModal";
import {
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Menu,
} from "lucide-react";

const bookingsPerPage = 15;

const WorkshopBookingsManagement = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const getBookingStatusColor = (st) => {
    switch (st) {
      case "pending":
        return "bg-[#F5F2EB] text-[#D36B3C]";
      case "confirmed":
        return "bg-[#EDF7ED] text-[#2F4138]";
      case "completed":
        return "bg-[#E8F4F2] text-[#2D6A6E]";
      case "canceled":
        return "bg-[#FBEAEA] text-[#D32F2F]";
      default:
        return "bg-[#F5F2EB] text-[#2F4138]";
    }
  };

  // Fetch all bookings once on mount, ignoring pagination params
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (localStorage.getItem("role") !== "admin") {
        setError("User is not authorized for this action");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`${baseUrl}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllBookings(data.bookings);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter bookings based on selectedStatus
  const filteredBookings =
    selectedStatus === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === selectedStatus);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  // Reset currentPage if filter changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const openModal = (id) => setSelectedId(id);
  const closeModal = () => setSelectedId(null);

  const FilterTabBtn = ({ status, label }) => {
    const count =
      status === "all"
        ? allBookings.length
        : allBookings.filter((b) => b.status === status).length;

    return (
      <button
        onClick={() => {
          setSelectedStatus(status);
          setCurrentPage(1);
          setShowMobileFilters(false);
        }}
        className={`w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between sm:justify-center space-x-2
          ${
            selectedStatus === status
              ? "bg-[#2F4138] text-white"
              : "bg-[#2F4138]/5 text-[#2F4138] hover:bg-[#2F4138]/10"
          }`}
      >
        <span>{label}</span>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{count}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 p-4">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-sm sm:text-base">Loading bookings...</p>
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

  const isNextButtonDisabled = currentPage >= totalPages;
  const isPrevButtonDisabled = currentPage <= 1;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Filter Section */}
      <div className="space-y-3 sm:space-y-0">
        {/* Desktop Filters */}
        <div className="hidden sm:flex items-center space-x-4">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F4138] flex-shrink-0" />
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <FilterTabBtn status="all" label="All Bookings" />
            <FilterTabBtn status="confirmed" label="Confirmed" />
            <FilterTabBtn status="canceled" label="Canceled" />
            <FilterTabBtn status="completed" label="Completed" />
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
                Filter: {selectedStatus === "all" ? "All Bookings" : selectedStatus}
              </span>
            </div>
            <Menu className={`w-4 h-4 transition-transform duration-200 ${showMobileFilters ? 'rotate-90' : ''}`} />
          </button>

          {/* Mobile Filter Dropdown */}
          {showMobileFilters && (
            <div className="mt-2 space-y-2 p-3 bg-white rounded-lg border border-[#2F4138]/10">
              <FilterTabBtn status="all" label="All Bookings" />
              <FilterTabBtn status="confirmed" label="Confirmed" />
              <FilterTabBtn status="canceled" label="Canceled" />
              <FilterTabBtn status="completed" label="Completed" />
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-[#2F4138]/10">
        {/* Mobile Card View */}
        <div className="sm:hidden">
          {paginatedBookings.map((b) => (
            <div
              key={b._id}
              onClick={() => openModal(b._id)}
              className="p-4 border-b border-[#2F4138]/10 last:border-b-0 hover:bg-[#2F4138]/5 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-[#2F4138]">
                    Booking #{String(b._id).slice(-5)}
                  </p>
                  <p className="text-xs text-[#2F4138]/70 mt-1">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(b.status)}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-[#2F4138] mb-2 truncate">
                {b.workshop_id?.title || "Unknown Workshop"}
              </p>
              <div className="flex justify-between items-center text-xs text-[#2F4138]/70">
                <span>Payment: {b.paymentStatus}</span>
              </div>
            </div>
          ))}
          
          {paginatedBookings.length === 0 && (
            <div className="p-6 text-center text-[#2F4138]/70">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No bookings found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2F4138]/5">
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Booking #</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Workshop Title</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Date</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Payment Status</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-[#2F4138]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F4138]/10">
              {paginatedBookings.map((b) => (
                <tr
                  key={b._id}
                  onClick={() => openModal(b._id)}
                  className="hover:bg-[#2F4138]/5 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">{String(b._id).slice(-5)}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138] max-w-xs truncate">{b.workshop_id?.title || "Unknown Workshop"}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-[#2F4138]">{b.paymentStatus}</td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-6 lg:py-8 text-center text-[#2F4138]/70">
                    <Calendar className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm lg:text-base">No bookings found</p>
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
          disabled={isPrevButtonDisabled}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm ${
            isPrevButtonDisabled
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
          disabled={isNextButtonDisabled}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm ${
            isNextButtonDisabled
              ? "bg-[#2F4138]/5 text-[#2F4138]/40 cursor-not-allowed"
              : "bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </button>
      </div>

      {/* Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <BookingDetailsModal bookingId={selectedBookingId} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopBookingsManagement;