import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import BookingSuccessDetails from "../components/BookingSuccessDetails"
import OrderSummary from "../components/OrderSummary";

const SuccessPage = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const type = queryParams.get("type");

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        console.log("Fetching payment data...");
        console.log("Session ID:", sessionId);
        console.log("Payment Type:", type);

        if (!sessionId || !type) {
          console.error("Missing sessionId or type");
          toast.error("Missing session ID or type.");
          return;
        }

        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          toast.error("You must be logged in to view this page.");
          setIsLoading(false);
          return;
        }

        let response;
        if (type === "workshop") {
          console.log("Fetching workshop booking data...");
          const url = `http://localhost:3050/bookings/success/${sessionId}`;
          console.log("API URL for workshop:", url);
          response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            console.log("Workshop booking data received:", response.data);
            setPaymentData(response.data);  // Setting payment data here
          } else {
            console.error("Failed to fetch workshop booking data, status:", response.status);
            toast.error("Failed to fetch workshop booking data.");
          }
        } else if (type === "product") {
          console.log("Fetching product order data...");
          const url = `http://localhost:3050/order/success/${sessionId}`;
          console.log("API URL for product:", url);
          response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            console.log("Product order data received:", response.data);
            setPaymentData(response.data);
          } else {
            console.error("Failed to fetch product order data, status:", response.status);
            toast.error("Failed to fetch product order data.");
          }
        } else {
          console.error("Unknown payment type:", type);
          toast.error("Unknown payment type.");
        }
      } catch (err) {
        if (err.response) {
          console.error("Error fetching payment data (response error):", err.response);
          toast.error(`Error fetching payment data: ${err.response.statusText}`);
        } else {
          console.error("Error fetching payment data:", err);
          toast.error("Error fetching payment data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && type) {
      fetchPaymentData();
    } else {
      console.error("Invalid sessionId or type.");
      setIsLoading(false);
    }
  }, [sessionId, type]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    console.error("No payment data found.");
    return <div>No payment data found.</div>;
  }

  console.log("Payment Data:", paymentData);  // Log out the fetched payment data here

  return (
    <div>
      <h1>Payment Successful!</h1>
      {type === "workshop" ? (
        <BookingSuccessDetails booking={paymentData} />
      ) : type === "product" ? (
        <OrderSummary order={paymentData.order} />
      ) : (
        <div>Unknown payment type</div>
      )}
    </div>
  );
};

export default SuccessPage;
