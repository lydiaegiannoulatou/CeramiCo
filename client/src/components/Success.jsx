import React, { useEffect } from 'react';

const Success = () => {
  useEffect(() => {
    // Optionally fetch session_id from URL if needed
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    console.log("Payment session ID:", sessionId);
  }, []);

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p>Thank you for your purchase. We’ll be shipping your items soon.</p>
    </div>
  );
};

export default Success;
