import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Calendar, Clock, Users, Loader2, ImageIcon, Info } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3050/workshops/${id}`
        );
        setWorkshop(response.data);

        const now = new Date();
        const available = response.data.sessions.filter(
          (session) =>
            new Date(session.sessionDate) > now && session.availableSpots > 0
        );
        setAvailableSessions(available);
      } catch (err) {
        console.error("Failed to fetch workshop", err);
        toast.error(
          "Failed to load workshop details. Please try again later.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
    const role = localStorage.getItem("role");
    setUserRole(role || "");
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [id]);

  const handleSelectTimeSlot = (session) => {
    if (!isLoggedIn) {
      toast.warning("Please log in to select a time slot.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSelectedSession(session);
    toast.success("Time slot selected!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleBooking = () => {
    if (!selectedSession) {
      toast.warning("Please select a time slot before booking.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    navigate(`/workshops/${workshop._id}/sessions/${selectedSession._id}`, {
      state: { workshop, selectedSession },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">
            Loading workshop details...
          </p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center text-[#2F4138]">
          <p className="text-xl font-medium">Workshop not found</p>
          <button
            onClick={() => navigate("/workshops")}
            className="mt-4 px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-[#2F4138] mb-4">
            {workshop.title}
          </h1>
          <div className="h-1 w-32 bg-[#2F4138]/20 rounded-full"></div>
        </div>

        <div className="aspect-video rounded-2xl overflow-hidden bg-[#2F4138]/5 mb-8">
          {workshop.image ? (
            <img
              src={workshop.image}
              alt={workshop.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={48} className="text-[#2F4138]/20" />
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="font-display text-2xl text-[#2F4138] mb-4">
            About this Workshop
          </h2>
          <p className="font-sans text-[#5C6760] leading-relaxed">
            {workshop.description}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-2xl text-[#2F4138] mb-6">
            Available Sessions
          </h2>

          {availableSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-[#2F4138]/20 mb-4" />
              <p className="text-[#5C6760] font-medium">
                No upcoming sessions available
              </p>
              <p className="text-[#5C6760] mt-2">
                Check back later for new dates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workshop.sessions.map((session) => {
                const sessionDate = new Date(session.sessionDate);
                const isPastSession = sessionDate < new Date();
                const isFullyBooked = session.availableSpots <= 0;
                const isDisabled = isPastSession || isFullyBooked;

                return (
                  <button
                    key={session._id}
                    onClick={() => !isDisabled && handleSelectTimeSlot(session)}
                    disabled={isDisabled}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed border-[#2F4138]/10 bg-[#2F4138]/5"
                          : selectedSession?._id === session._id
                          ? "border-[#2F4138] bg-[#2F4138]/5"
                          : "border-[#2F4138]/10 hover:border-[#2F4138]/30"
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-[#2F4138]" />
                      <div className="text-left">
                        <p className="font-medium text-[#2F4138]">
                          {sessionDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-[#5C6760]">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {sessionDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {isFullyBooked
                                ? "Fully booked"
                                : isPastSession
                                ? "Session ended"
                                : `${session.availableSpots} spots left`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {!isLoggedIn && (
                <div className="mt-6 flex items-start space-x-2 bg-[#F5F2EB] p-4 rounded-lg max-w-lg mx-auto">
                  <Info className="w-5 h-5 text-[#5C6760] mt-0.5 flex-shrink-0" />
                  <p className="text-[#5C6760] italic text-sm">
                    Please log in to select a time slot and book this workshop.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            {userRole === "admin" ? (
              <div className="flex items-start space-x-2 bg-[#F5F2EB] p-4 rounded-lg max-w-lg mx-auto">
                <Info className="w-5 h-5 text-[#5C6760] mt-0.5 flex-shrink-0" />
                <p className="text-[#5C6760] italic text-sm">
                  Nice try, boss! Admins can't book workshops—switch to a
                  regular account to join the fun!
                </p>
              </div>
            ) : (
              <button
                onClick={handleBooking}
                disabled={!selectedSession || availableSessions.length === 0}
                className={`px-8 py-4 rounded-full font-medium flex items-center space-x-2 transition-all duration-200
                  ${
                    selectedSession
                      ? "bg-[#2F4138] text-white hover:bg-[#3A4F44] transform hover:scale-105"
                      : "bg-[#2F4138]/20 text-[#2F4138] cursor-not-allowed"
                  }`}
              >
                <span>Book this Workshop</span>
                {selectedSession && <Calendar className="w-5 h-5 ml-2" />}
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WorkshopDetailPage;
