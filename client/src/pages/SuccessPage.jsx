import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, AlertCircle } from "lucide-react";
import BookingSummary from "../components/BookingSummary";
import OrderSummary from "../components/OrderSummary";

const SuccessPage = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const type = queryParams.get("type");

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        if (!sessionId || !type) {
          toast.error("Missing session ID or type.");
          return;
        }

        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view this page.");
          navigate("/login");
          return;
        }

        let response;
        if (type === "workshop") {
          response = await axios.get(
            `http://localhost:3050/bookings/success/${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPaymentData(response.data);
        } else if (type === "product") {
          response = await axios.get(
            `http://localhost:3050/order/success/${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPaymentData(response.data);
        } else {
          toast.error("Unknown payment type.");
        }
      } catch (err) {
        if (err.response) {
          toast.error(`Error: ${err.response.data.message || "Failed to fetch payment data"}`);
        } else {
          toast.error("Error fetching payment data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && type) {
      fetchPaymentData();
    } else {
      setIsLoading(false);
    }
  }, [sessionId, type, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <h2 className="text-2xl font-display text-[#2F4138]">Payment Not Found</h2>
          <p className="text-[#5C6760] max-w-md mx-auto">
            We couldn't find the payment information. Please check your email for confirmation or contact support.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-[#2F4138] text-white rounded-full hover:bg-[#3C685A] transition-colors duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#3C685A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-[#3C685A] rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-display text-[#2F4138] mb-4">
            Thank You for Your {type === "workshop" ? "Booking" : "Purchase"}!
          </h1>
          <p className="text-[#5C6760] text-lg max-w-2xl mx-auto">
            {type === "workshop"
              ? "Your workshop booking has been confirmed. We've sent the details to your email."
              : "Your order has been confirmed. We've sent the order details to your email."}
          </p>
        </div>

        {/* Payment Details */}
        {type === "workshop" ? (
          <BookingSummary booking={paymentData} />
        ) : type === "product" ? (
          <OrderSummary order={paymentData.order} />
        ) : (
          <div className="text-center text-[#5C6760]">Unknown payment type</div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;