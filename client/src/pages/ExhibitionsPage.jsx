import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, ImageIcon, Calendar, MapPin } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const fetchExhibitions = async () => {
    try {
      const res = await axios.get(`${baseUrl}/exhibitions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExhibitions(res.data);
    } catch (err) {
      console.error("Error fetching exhibitions:", err);
      setError("Could not load exhibitions");
      toast.error("Failed to load exhibitions. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading exhibitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calendar className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Couldn't load exhibitions</p>
          <button
            onClick={fetchExhibitions}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!exhibitions.length) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calendar className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">No exhibitions available</p>
          <p className="text-[#5C6760]">Check back later for new exhibitions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-[#2F4138] mb-4">Exhibitions</h1>
          <div className="h-1 w-32 bg-[#2F4138]/20 rounded-full mx-auto"></div>
        </div>

        {/* Exhibitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibitions.map((exhibition) => (
            <Link
              key={exhibition._id}
              to={`/exhibitions/${exhibition._id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] relative overflow-hidden bg-[#2F4138]/5">
                {exhibition.media?.[0] ? (
                  <img
                    src={exhibition.media[0]}
                    alt={exhibition.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-[#2F4138]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="font-display text-2xl text-[#2F4138] mb-2 group-hover:text-[#3A4F44] transition-colors duration-200">
                  {exhibition.title}
                </h2>

                <div className="flex items-center text-[#5C6760] mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{exhibition.location || "Gallery Space"}</span>
                </div>

                <p className="text-[#5C6760] flex-grow">
                  {exhibition.description.length > 120
                    ? `${exhibition.description.slice(0, 120)}...`
                    : exhibition.description}
                </p>

                {/* Details Link */}
                <div className="mt-6 pt-4 border-t border-[#2F4138]/10 flex justify-end">
                  <span className="text-sm text-[#5C6760] group-hover:text-[#2F4138] transition-colors duration-200">
                    View Exhibition →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExhibitionsPage;