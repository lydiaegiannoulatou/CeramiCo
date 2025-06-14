import React, { useState, useEffect } from "react";
import axios from "axios";

const STATUS_FLOW = ["processing", "shipped", "delivered", "canceled"];

const OrderDetailsModal = ({ order, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
const baseUrl = import.meta.env.VITE_BASE_URL;
  const userId = order.user_id;
  const isAdmin = localStorage.getItem("role") === "admin";
  const lowerStatus = orderStatus.toLowerCase();
  const isCanceled = lowerStatus === "canceled";

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${baseUrl}/user/profile/${userId}`)
      .then(r => setUserDetails(r.data))
      .catch(e => console.error("Error fetching user details:", e));
  }, [userId]);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const backendUpdate = newStatus =>
    axios.put(
      `${baseUrl}/order/update/${order._id}`,
      { orderStatus: newStatus },
      { headers: authHeader }
    );

  const backendCancel = () =>
    axios.put(
      `${baseUrl}/order/cancel/${order._id}`,
      null,
      { headers: authHeader }
    );

  const handleStatusChange = async newStatus => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    try {
      await backendUpdate(newStatus);
      setOrderStatus(newStatus);
      setDropdownOpen(false);
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to update order status.");
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setIsCancelling(true);
    try {
      await backendCancel();
      setOrderStatus("canceled");
      setDropdownOpen(false);
      alert("Order canceled successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const disabled = status =>
    STATUS_FLOW.indexOf(status) < STATUS_FLOW.indexOf(lowerStatus);

  if (!order) return null;
  if (!userDetails) return <p>Loading user details…</p>;

  const { orderNumber, paymentStatus, shippingAddress, totalCost, currency, items, createdAt } = order;

  return (
    <div className="relative border p-6 rounded-2xl shadow-md bg-white mt-6 space-y-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Order Confirmation</h2>

        {!isAdmin && !isCanceled && (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isCancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        )}

        {isAdmin && !isCanceled && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Change Status
            </button>

            {dropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-lg mt-2 w-full z-10">
                {STATUS_FLOW.slice(0, -1).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={disabled(st)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-200 capitalize ${
                      disabled(st) ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    Mark as {st}
                  </button>
                ))}
                <button
                  onClick={handleCancelOrder}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order details summary */}
      <div className="grid grid-cols-2 gap-4 text-base">
        <p><strong>Order #:</strong> {orderNumber}</p>
        <p><strong>Status:</strong> {orderStatus}</p>
        <p><strong>Payment:</strong> {paymentStatus}</p>
        <p><strong>Total:</strong> {totalCost} {currency}</p>
        <p><strong>Date:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>

      {/* User details */}
      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-2">User Details</h3>
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
      </div>

      {/* Shipping address */}
      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
        {shippingAddress ? (
          <div>
            <p><strong>Full Name:</strong> {shippingAddress.fullName}</p>
            <p><strong>Address Line 1:</strong> {shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && (
              <p><strong>Address Line 2:</strong> {shippingAddress.addressLine2}</p>
            )}
            <p><strong>City:</strong> {shippingAddress.city}</p>
            <p><strong>Postal Code:</strong> {shippingAddress.postalCode}</p>
            <p><strong>Country:</strong> {shippingAddress.country}</p>
            {shippingAddress.phone && (
              <p><strong>Phone:</strong> {shippingAddress.phone}</p>
            )}
          </div>
        ) : (
          <p>No shipping address provided.</p>
        )}
      </div>

      {/* Items list */}
      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-4">Items</h3>
        {Array.isArray(items) && items.length ? (
          <ul className="space-y-4">
            {items.map(({ product_id, quantity, price }, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <img
                  src={product_id?.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product_id?.title || "Product"}
                  className="w-24 h-24 rounded-lg object-cover shadow"
                />
                <div>
                  <p className="font-semibold">{product_id?.title || "N/A"}</p>
                  <p>Qty: {quantity}</p>
                  <p>{price} {currency}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
