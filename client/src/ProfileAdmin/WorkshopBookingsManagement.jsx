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
} from "lucide-react";

const bookingsPerPage = 15;

const WorkshopBookingsManagement = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
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
        }}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2
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
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138]">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const isNextButtonDisabled = currentPage >= totalPages;
  const isPrevButtonDisabled = currentPage <= 1;

  return (
    <div>
      {/* Filter Section */}
      <div className="flex items-center space-x-4 mb-8">
        <Filter className="w-5 h-5 text-[#2F4138]" />
        <div className="flex space-x-3">
          <FilterTabBtn status="all" label="All Bookings" />
          <FilterTabBtn status="confirmed" label="Confirmed" />
          <FilterTabBtn status="canceled" label="Canceled" />
          <FilterTabBtn status="completed" label="Completed" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-[#2F4138]/10">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2F4138]/5">
              <th className="px-6 py-4 text-left text-sm font-medium text-[#2F4138]">Booking #</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#2F4138]">Workshop Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#2F4138]">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#2F4138]">Payment Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#2F4138]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2F4138]/10">
            {paginatedBookings.map((b) => (
              <tr
                key={b._id}
                onClick={() => openModal(b._id)}
                className="hover:bg-[#2F4138]/5 transition-colors duration-150 cursor-pointer"
              >
                <td className="px-6 py-4 text-sm text-[#2F4138]">{String(b._id).slice(-5)}</td>
                <td className="px-6 py-4 text-sm text-[#2F4138]">{b.workshop_id?.title || "Unknown Workshop"}</td>
                <td className="px-6 py-4 text-sm text-[#2F4138]">{new Date(b.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-[#2F4138]">{b.paymentStatus}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedBookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#2F4138]/70">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          disabled={isPrevButtonDisabled}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`flex items-center px-4 py-2 rounded-xl transition-colors duration-200 ${
            isPrevButtonDisabled
              ? "bg-[#2F4138]/5 text-[#2F4138]/40 cursor-not-allowed"
              : "bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20"
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        <span className="text-sm text-[#2F4138] font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={isNextButtonDisabled}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`flex items-center px-4 py-2 rounded-xl transition-colors duration-200 ${
            isNextButtonDisabled
              ? "bg-[#2F4138]/5 text-[#2F4138]/40 cursor-not-allowed"
              : "bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20"
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Modal */}
      {selectedBookingId && <BookingDetailsModal bookingId={selectedBookingId} onClose={closeModal} />}
    </div>
  );
};

export default WorkshopBookingsManagement;
