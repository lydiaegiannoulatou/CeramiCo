import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetailsModal = ({ order }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Extract user_id safely (could be undefined if order is null)
  const userId = order.user_id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:3050/user/profile/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!order) return null;
  if (!userDetails) return <p>Loading user details...</p>;

  const {
    orderNumber,
    orderStatus,
    paymentStatus,
    shippingAddress,
    totalCost,
    currency,
    items,
    createdAt,
    _id,
  } = order;
console.log("order._id",order._id);
console.log("shippingAddress:",order.shippingAddress)

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      await axios.put(`http://localhost:3050/order/cancel/${order._id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Order canceled successfully.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <div className="border p-6 rounded-2xl shadow-md bg-white mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Order Confirmation</h2>
        {orderStatus !== "Canceled" && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-base">
        <p><span className="font-semibold">Order #:</span> {orderNumber}</p>
        <p><span className="font-semibold">Status:</span> {orderStatus}</p>
        <p><span className="font-semibold">Payment:</span> {paymentStatus}</p>
        <p><span className="font-semibold">Total:</span> {totalCost} {currency}</p>
        <p><span className="font-semibold">Date:</span> {new Date(createdAt).toLocaleString()}</p>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-2">User Details</h3>
        <p><span className="font-semibold">Name:</span> {userDetails.name}</p>
        <p><span className="font-semibold">Email:</span> {userDetails.email}</p>
      </div>
      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
        {shippingAddress ? (
          <div>
            <p><span className="font-semibold">Full Name:</span> {shippingAddress.fullName}</p>
            <p><span className="font-semibold">Address Line 1:</span> {shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && (
              <p><span className="font-semibold">Address Line 2:</span> {shippingAddress.addressLine2}</p>
            )}
            <p><span className="font-semibold">City:</span> {shippingAddress.city}</p>
            <p><span className="font-semibold">Postal Code:</span> {shippingAddress.postalCode}</p>
            <p><span className="font-semibold">Country:</span> {shippingAddress.country}</p>
            {shippingAddress.phone && (
              <p><span className="font-semibold">Phone:</span> {shippingAddress.phone}</p>
            )}
          </div>
        ) : (
          <p>No shipping address provided.</p>
        )}
      </div>

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
