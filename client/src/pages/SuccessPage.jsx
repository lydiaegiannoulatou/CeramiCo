import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import OrderSummary from '../components/OrderSummary';

const SuccessPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // Extract session_id from query params
  const sessionId = new URLSearchParams(location.search).get('session_id');
  console.log('sessionId:', sessionId);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3050/order/success/${sessionId}`);
        console.log("Response order", response);

        if (response.data.order) {
          setOrder(response.data.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not load order details.");
      }
    };

    if (sessionId) {
      fetchOrder();
    }
  }, [sessionId]);

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-6">Loading your order...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">🎉 Payment Successful!</h1>
      <p className="text-center mb-4 text-gray-600">Here are your order details:</p>
      <OrderSummary order={order} />
    </div>
  );
};

export default SuccessPage;
