import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import ToastNotification from "../components/ToastNotification";

const OrderSummary = ({ order, onClose, onStatusChange, userRole }) => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state

  const sessionId = order?.stripeSessionId || order?._id;

  console.log("SessionId:", sessionId);

  useEffect(() => {
    if (!sessionId) return; // Exit if sessionId does not exist

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3050/order/success/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Order Data:", data);

        if (data && data.order) {
          setOrderDetails(data.order); // Set the order data to state
        } else {
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

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
       await axios.put(
        `http://localhost:3050/order/update/${orderDetails._id}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastNotification.notifySuccess(`Order status updated to ${newStatus}`);
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        orderStatus: newStatus
      })); // Update only the orderStatus, avoid resetting the whole object
      setDropdownOpen(false); // Close the dropdown after status change
    } catch (err) {
      console.error("Error updating order status:", err);
      ToastNotification.notifyError("Unable to update order status.");
    }
  };

  // Loading state or if order details are not available
  if (loading) return <p className="text-center">Loading order…</p>;

  if (!orderDetails) return <p className="text-center">Order not found.</p>;

  // Disable dropdown if the order is canceled
  const isOrderCanceled = orderDetails.orderStatus === "canceled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose} // Ensure this only closes the modal when the close button is clicked
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
          <p><strong>Total:</strong> {(orderDetails.totalCost / 100).toFixed(2)} {orderDetails.currency}</p>
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
                        src={item.product_id.images[0]} 
                        alt={item.product_id.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product_id?.title ?? "Product"}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: {(item.price / 100).toFixed(2)} {orderDetails.currency}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {item.workshop_id?.image && (
                      <img
                        src={item.workshop_id.image}
                        alt={item.workshop_id.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.classTitle ?? item.workshop_id?.title}</p>
                      <p>Session: {new Date(item.sessionDate).toLocaleString()}</p>
                      <p>Price: {(item.price / 100).toFixed(2)} {orderDetails.currency}</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Admin dropdown for status change */}
        {localStorage.getItem("role") === "admin" && !isOrderCanceled && (
          <div className="relative mb-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full text-left text-sm"
            >
              Change Status
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-lg w-full mt-2 z-10">
                <button
                  onClick={() => handleStatusChange("shipped")}
                  className="w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleStatusChange("delivered")}
                  className="w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => handleStatusChange("canceled")}
                  className="w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cancel button for users in processing state */}
        {orderDetails.orderStatus === "processing" && userRole !== "admin" && (
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
