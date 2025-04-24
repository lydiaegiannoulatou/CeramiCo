import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import ToastNotification from "../components/ToastNotification";

const OrderSummary = ({ order, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null); // Local state to store fetched order data

  const sessionId = order?.stripeSessionId || order?._id;

  console.log("SessionId:", sessionId);

  useEffect(() => {
    if (!sessionId) return; // Exit early if no session ID exists

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3050/order/success/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Order Data:", data); // Log the whole response for debugging

        if (data && data.order) {
          setOrderDetails(data.order); // Set the order data to state
        } else {
          // Handle the case where the order is not found or there is an error in the response
          ToastNotification.notifyError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        ToastNotification.notifyError("Unable to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <p className="text-center">Loading order…</p>;

  if (!orderDetails) return <p className="text-center">Order not found.</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Order #{orderDetails.orderNumber ?? orderDetails._id.slice(-6)}
        </h2>

        {/* Order details */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
          <p><strong>Payment:</strong> {orderDetails.paymentStatus}</p>
          <p><strong>Total:</strong> {orderDetails.totalCost.toFixed(2)} {orderDetails.currency}</p>
          <p><strong>Placed:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
        </div>

        {/* User Details */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">User Information</h3>
          <p><strong>Name:</strong> {orderDetails.user_id?.name}</p>
          <p><strong>Email:</strong> {orderDetails.user_id?.email}</p>
        </div>
{/* Shipping Address */}
<div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Shipping Address</h3>
          <p><strong>Name:</strong> {orderDetails.shippingAddress?.fullName}</p>
          <p><strong>Address:</strong> {orderDetails.shippingAddress?.addressLine1}, {orderDetails.shippingAddress?.addressLine2}</p>
          <p><strong>City:</strong> {orderDetails.shippingAddress?.city}</p>
          <p><strong>Postal Code:</strong> {orderDetails.shippingAddress?.postalCode}</p>
          <p><strong>Country:</strong> {orderDetails.shippingAddress?.country}</p>
          <p><strong>Phone:</strong> {orderDetails.shippingAddress?.phone}</p>
        </div>

        {/* Items list */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Items</h3>
          <ul className="space-y-4">
            {orderDetails.items.map((item, idx) => (
              <li key={idx} className="border rounded-lg p-4 flex items-start gap-4 shadow-sm">
                {item.type === "product" ? (
                  <>
                    {item.product_id?.images?.length > 0 && (
                      <img
                        src={item.product_id.images[0]}  // Use the first image for product
                        alt={item.product_id.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product_id?.title ?? "Product"}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: {item.price.toFixed(2)} {orderDetails.currency}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {item.workshop_id?.image && (
                      <img
                        src={item.workshop_id.image}
                        alt={item.workshop_id.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.classTitle ?? item.workshop_id?.title}</p>
                      <p>Session: {new Date(item.sessionDate).toLocaleString()}</p>
                      <p>Price: {item.price.toFixed(2)} {orderDetails.currency}</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Cancel button */}
        {orderDetails.orderStatus === "processing" && (
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onStatusChange} // Trigger status change
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
