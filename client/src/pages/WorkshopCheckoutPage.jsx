import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Calendar, Clock, CreditCard, Loader2, AlertCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const WorkshopCheckoutPage = () => {
  const [workshop, setWorkshop] = useState(null);
  const [session, setSession] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
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
        toast.error("Error loading workshop details. Please try again later.", {
          position: "top-right",
          autoClose: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [workshopId, sessionId]);

  const handleStripeCheckout = async () => {
    if (!token) {
      toast.info("Please sign in to book this workshop", {
        position: "top-right",
        autoClose: 3000
      });
      navigate("/login");
      return;
    }

    if (session.bookedSpots >= workshop.maxSpots) {
      toast.warning("This session is fully booked.", {
        position: "top-right",
        autoClose: 3000
      });
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
        toast.error("Payment session could not be created. Please try again.", {
          position: "top-right",
          autoClose: 5000
        });
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      toast.error("Could not process payment. Please try again later.", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (!workshop || !session) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Workshop details not found</p>
          <button
            onClick={() => navigate("/workshops")}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-3xl text-[#2F4138] mb-8 text-center">Confirm Your Booking</h1>

          <div className="space-y-6">
            {/* Workshop Details */}
            <div className="bg-[#2F4138]/5 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#2F4138]">Workshop</span>
                <span className="text-[#5C6760]">{workshop.title}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-[#2F4138]">Date</span>
                <div className="flex items-center text-[#5C6760]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(session.sessionDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-[#2F4138]">Time</span>
                <div className="flex items-center text-[#5C6760]">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(session.sessionDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-[#2F4138]/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium text-[#2F4138]">Total Price</span>
                <span className="text-xl font-medium text-[#2F4138]">{workshop.price} EUR</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleStripeCheckout}
              disabled={isRedirecting}
              className="w-full mt-8 py-4 px-8 bg-[#2F4138] text-white rounded-full font-medium 
                flex items-center justify-center space-x-2 
                hover:bg-[#3A4F44] transition-all duration-200 
                disabled:bg-[#2F4138]/50 disabled:cursor-not-allowed"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Redirecting to Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-[#5C6760] mt-4">
              You will be redirected to our secure payment provider
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WorkshopCheckoutPage;