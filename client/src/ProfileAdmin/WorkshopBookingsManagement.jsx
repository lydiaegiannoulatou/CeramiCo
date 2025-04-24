import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingDetailsModal from "../ProfileUser/BookingDetailsModal";

const bookingsPerPage = 15;

const WorkshopBookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");

  /* ───────── helper ───────── */
  const getBookingStatusColor = (st) => {
    switch (st) {
      case "pending":   return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100  text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "canceled":  return "bg-red-100   text-red-700";
      default:          return "bg-gray-100  text-gray-700";
    }
  };

  /* ───────── effect: fetch bookings ───────── */
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (localStorage.getItem("role") !== "admin") {
        setError("User is not authorized for this action");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:3050/bookings", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: bookingsPerPage },
        });

        setBookings(data.bookings);
        setTotalPages(Math.ceil(data.totalBookings / bookingsPerPage));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  /* ───────── effect: apply status filter whenever list or tab changes ───────── */
  useEffect(() => {
    const list =
      selectedStatus === "all"
        ? bookings
        : bookings.filter((b) => b.status === selectedStatus);
    setFiltered(list);
  }, [selectedStatus, bookings]);

  const openModal = (id) => setSelectedId(id);
  const closeModal = () => setSelectedId(null);

  // Pill filter button component
  const FilterTabBtn = ({ status, label }) => {
    // Calculate count for each status, including "all"
    let count;
    if (status === "all") {
      count = bookings.length; // Show total number of bookings for "all"
    } else {
      count = bookings.filter((b) => b.status === status).length;
    }

    return (
      <button
        onClick={() => { 
          setSelectedStatus(status); 
          setCurrentPage(1); 
        }}
        className={`px-5 py-1 text-sm capitalize flex items-center gap-1
          ${selectedStatus === status
          ? "text-white"
          : "text-gray-700 hover:bg-gray-200"
        }
        ${status !== 'all' ? "border-l" : ""}  /* divider */
      `}
      style={{
        backgroundColor: selectedStatus === status ? "#D36B3C" : "transparent"
      }}
    >
      {label} 
      <span className="font-semibold">({count})</span>
    </button>
  );
}

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  // Calculate if the "Next" button should be disabled
  const isNextButtonDisabled =
    bookings.length <= currentPage * bookingsPerPage || currentPage >= totalPages;
  const isPrevButtonDisabled = currentPage <= 1;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workshop Bookings</h2>

      {/* Filter pills */}
      <div className="inline-flex rounded-full overflow-hidden mb-6 border">
        <FilterTabBtn status="all"       label="All" />
        <FilterTabBtn status="confirmed" label="Confirmed" />
        <FilterTabBtn status="canceled"  label="Canceled" />
        <FilterTabBtn status="completed" label="Completed" />
      </div>

      {/* table */}
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border">Booking #</th>
            <th className="px-4 py-2 border">Workshop Title</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Payment Status</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((b) => (
            <tr key={b._id} className="cursor-pointer hover:bg-gray-100" onClick={() => openModal(b._id)}>
              <td className="px-4 py-2 border">{String(b._id).slice(-5)}</td>
              <td className="px-4 py-2 border">{b.workshop_id.title}</td>
              <td className="px-4 py-2 border">{new Date(b.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">{b.paymentStatus}</td>
              <td className="px-4 py-2 border">
                <span className={`px-2 py-1 rounded-full text-sm ${getBookingStatusColor(b.status)}`}>
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredBookings.length === 0 && (
            <tr><td colSpan={5} className="text-center py-4 text-gray-500">No bookings</td></tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          disabled={isPrevButtonDisabled}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg ${isPrevButtonDisabled ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          &lt; Previous
        </button>
        <button
          disabled={isNextButtonDisabled}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg ${isNextButtonDisabled ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Next &gt;
        </button>
      </div>

      {/* modal */}
      {selectedBookingId && (
        <BookingDetailsModal bookingId={selectedBookingId} onClose={closeModal} />
      )}
    </div>
  );
};

export default WorkshopBookingsManagement;
