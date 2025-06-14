import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Package, Calendar, MapPin, Phone, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const OrderSummary = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || orderId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isAdmin = localStorage.getItem("role") === "admin";
const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${baseUrl}/order/success/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data && data.order) {
          setOrderDetails(data.order);
        } else {
          toast.error("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  const handleStatusChange = async (newStatus) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/order/update/${orderDetails._id}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrderDetails(prev => ({
        ...prev,
        orderStatus: newStatus
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      canceled: "bg-red-50 text-red-700 border-red-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Invalid order reference</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Order not found</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Order Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display text-[#2F4138] mb-2">
                Order #{orderDetails.orderNumber || orderDetails._id.slice(-6)}
              </h1>
              <p className="text-[#5C6760]">
                Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getStatusColor(orderDetails.orderStatus)}`}>
              {orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1)}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="font-medium text-[#2F4138] mb-2 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Summary
              </h2>
              <div className="space-y-2 text-[#5C6760]">
                <p>Payment Status: {orderDetails.paymentStatus}</p>
                <p>Total Amount: €{orderDetails.totalCost.toFixed(2)}</p>
                <p>Currency: {orderDetails.currency}</p>
              </div>
            </div>

            <div>
              <h2 className="font-medium text-[#2F4138] mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </h2>
              <div className="space-y-2 text-[#5C6760]">
                <p>Created: {new Date(orderDetails.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(orderDetails.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-display text-[#2F4138] mb-6">Order Items</h2>
          <div className="space-y-6">
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="flex gap-6 pb-6 border-b border-[#2F4138]/10 last:border-0">
                <img
                  src={item.product_id?.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.product_id?.title || "Product"}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-[#2F4138]">{item.product_id?.title}</h3>
                  <p className="text-[#5C6760] mt-1">Quantity: {item.quantity}</p>
                  <p className="text-[#3f612d] font-medium mt-2">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-display text-[#2F4138] mb-6">Shipping Details</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-[#2F4138] mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>
              <div className="space-y-2 text-[#5C6760]">
                <p>{orderDetails.shippingAddress.fullName}</p>
                <p>{orderDetails.shippingAddress.addressLine1}</p>
                {orderDetails.shippingAddress.addressLine2 && (
                  <p>{orderDetails.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}
                </p>
                <p>{orderDetails.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[#2F4138] mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-2 text-[#5C6760]">
                <p>Phone: {orderDetails.shippingAddress.phone}</p>
                <p>Email: {orderDetails.user_id?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && orderDetails.orderStatus !== "canceled" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-display text-[#2F4138] mb-6">Order Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleStatusChange("shipped")}
                disabled={isProcessing || orderDetails.orderStatus === "shipped" || orderDetails.orderStatus === "delivered"}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Package className="w-5 h-5 mr-2" />
                )}
                Mark as Shipped
              </button>

              <button
                onClick={() => handleStatusChange("delivered")}
                disabled={isProcessing || orderDetails.orderStatus === "delivered"}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                )}
                Mark as Delivered
              </button>

              <button
                onClick={() => handleStatusChange("canceled")}
                disabled={isProcessing}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                Cancel Order
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderSummary;