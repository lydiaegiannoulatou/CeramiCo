import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WorkshopCheckoutPage = () => {
  const [workshop, setWorkshop] = useState(null);
  const [session, setSession] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const token = localStorage.getItem("token");
  const { workshopId, sessionId } = useParams();

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3050/workshops/${workshopId}`
        );
        const selectedSession = response.data.sessions.find(
          (s) => s._id === sessionId
        );
        setWorkshop(response.data);
        setSession(selectedSession);
      } catch (err) {
        console.error("Error fetching workshop data", err);
        toast.error("Error loading workshop details.");
      }
    };

    fetchWorkshopData();
  }, [workshopId, sessionId]);

  const handleStripeCheckout = async () => {
    if (!token) {
      toast.info("You need to be logged in to book a workshop.");
      return;
    }

    if (session.bookedSpots >= workshop.maxSpots) {
      toast.warning("This session is fully booked.");
      return;
    }

    setIsRedirecting(true);

    try {
      const response = await axios.post(
        "http://localhost:3050/payment/checkout",
        {
          items: [
            {
              id: workshop._id,
              sessionId: session._id,  
              type: "workshop",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Payment session failed.");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      toast.error("Could not initiate payment.");
    } finally {
      setIsRedirecting(false);
    }
  };

  if (!workshop || !session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Confirm Your Booking</h1>

      <div className="space-y-6">
        <div className="flex justify-between">
          <p className="text-lg font-medium">Workshop:</p>
          <p className="text-lg">{workshop.title}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-lg font-medium">Session:</p>
          <p className="text-lg">{new Date(session.sessionDate).toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-lg font-medium">Price:</p>
          <p className="text-lg">{workshop.price} EUR</p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleStripeCheckout}
          disabled={isRedirecting}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none transition duration-300"
        >
          {isRedirecting ? "Redirecting to Payment..." : "Pay & Book"}
        </button>
      </div>
    </div>
  );
};

export default WorkshopCheckoutPage;