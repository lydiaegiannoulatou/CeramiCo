import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, MapPin, Users, Clock, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

const WorkshopCheckoutPage = () => {
  const [workshop, setWorkshop] = useState(null);
  const [session, setSession] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { workshopId, sessionId } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshopData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/workshops/${workshopId}`
        );
        const selectedSession = response.data.sessions.find(
          (s) => s._id === sessionId
        );
        
        if (!selectedSession) {
          toast.error("Session not found");
          navigate("/workshops");
          return;
        }
        
        setWorkshop(response.data);
        setSession(selectedSession);
      } catch (err) {
        console.error("Error fetching workshop data", err);
        toast.error("Error loading workshop details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [workshopId, sessionId, navigate]);

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
        `${baseUrl}/payment/checkout`,
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

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#2F4138]/10 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3 bg-white/80 rounded-xl p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-[#2F4138]/10 rounded w-full"></div>
              ))}
            </div>
            <div className="md:col-span-2 bg-white/80 rounded-xl p-6 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-4 bg-[#2F4138]/10 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workshop || !session) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-[#5C6760]">Workshop or session not found.</p>
        <button 
          onClick={handleGoBack}
          className="mt-4 text-[#2F4138] hover:text-[#5C6760] flex items-center justify-center mx-auto transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
      </div>
    );
  }

  // Calculate remaining spots
  const remainingSpots = workshop.maxSpots - (session?.bookedSpots || 0);
  const availabilityColor = 
    remainingSpots <= 3 ? "text-[#8B4513]" : 
    remainingSpots <= 5 ? "text-[#2F4138]" : 
    "text-[#3C685A]";

  // Format the date nicely
  const formattedDate = new Date(session?.sessionDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format the time
  const formattedTime = new Date(session?.sessionDate).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={handleGoBack}
            className="text-[#5C6760] hover:text-[#2F4138] transition-colors flex items-center text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to workshops
          </button>
          
          <h1 className="font-display text-4xl text-center text-[#2F4138] mt-6 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-center text-[#5C6760] max-w-2xl mx-auto font-sans">
            You're almost there! Review the details of your workshop booking and proceed to secure checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Workshop details */}
          <div className="md:col-span-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-[#2F4138]/10 p-6 transition-all duration-200 hover:shadow-md">
              <h2 className="font-display text-2xl text-[#2F4138] mb-4">
                {workshop.title}
              </h2>
              
              {workshop.description && (
                <p className="text-[#5C6760] mb-6 leading-relaxed font-sans">
                  {workshop.description}
                </p>
              )}
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#2F4138] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#2F4138]">{formattedDate}</p>
                    <p className="text-sm text-[#5C6760]">Date</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#2F4138] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#2F4138]">{formattedTime}</p>
                    <p className="text-sm text-[#5C6760]">Time</p>
                  </div>
                </div>
                
                {workshop.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#2F4138] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[#2F4138]">{workshop.location}</p>
                      <p className="text-sm text-[#5C6760]">Location</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-[#2F4138] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className={`font-medium ${availabilityColor}`}>
                      {remainingSpots} {remainingSpots === 1 ? 'spot' : 'spots'} remaining
                    </p>
                    <p className="text-sm text-[#5C6760]">Availability</p>
                  </div>
                </div>
              </div>
              
              {workshop.instructor && (
                <div className="mt-6 pt-6 border-t border-[#2F4138]/10">
                  <p className="font-medium text-[#2F4138]">Instructor</p>
                  <p className="text-[#5C6760]">{workshop.instructor}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-[#2F4138]/10 p-6 transition-all duration-200 hover:shadow-md">
              <h2 className="font-display text-2xl text-[#2F4138] mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#5C6760]">Workshop fee</span>
                  <span className="text-[#2F4138] font-medium">{workshop.price} EUR</span>
                </div>
                
                {workshop.materials && (
                  <div className="flex justify-between">
                    <span className="text-[#5C6760]">Materials</span>
                    <span className="text-[#2F4138] font-medium">{workshop.materials} EUR</span>
                  </div>
                )}
                
                <div className="pt-3 mt-3 border-t border-[#2F4138]/10 flex justify-between">
                  <span className="text-[#2F4138] font-semibold">Total</span>
                  <span className="text-[#2F4138] text-lg font-bold">{workshop.price} EUR</span>
                </div>
              </div>
              
              <button
                onClick={handleStripeCheckout}
                disabled={isRedirecting}
                className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isRedirecting 
                    ? "bg-[#2F4138]/60 cursor-not-allowed" 
                    : "bg-[#2F4138] hover:bg-[#3C685A] active:bg-[#2F4138]"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  {isRedirecting ? "Preparing Checkout..." : "Secure Checkout"}
                </span>
              </button>
              
              <div className="mt-4 flex items-center justify-center text-sm text-[#5C6760]">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-[#3C685A]" />
                <span>Secure payment processing</span>
              </div>
              
              <div className="mt-5 pt-4 border-t border-[#2F4138]/10">
                <p className="text-sm text-[#5C6760] text-center font-sans">
                  By proceeding, you agree to our Terms and Conditions and acknowledge that you have read our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCheckoutPage;