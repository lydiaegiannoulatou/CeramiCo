import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, Calendar, MapPin, Users, Tag, Trash2, AlertCircle } from "lucide-react";
import ImageCarousel from"../components/ImageCarousel"
import "react-toastify/dist/ReactToastify.css";

const ExhibitionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchExhibition = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      setIsAdmin(userRole === "admin");

      try {
        const res = await axios.get(`${baseUrl}/exhibitions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExhibition(res.data);
      } catch (err) {
        console.log(err);
        
        setError("Failed to load exhibition details");
        toast.error("Failed to load exhibition details. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id]);

  const handleDeleteExhibition = async () => {
    toast.warn(
      <div className="p-6">
        <h4 className="text-lg font-medium mb-4">Delete Exhibition?</h4>
        <p className="text-sm mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              try {
                await axios.delete(`${baseUrl}/exhibitions/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Exhibition deleted successfully");
                navigate("/exhibitions");
              } catch (err) {
                console.log(err);
                
                toast.error("Failed to delete exhibition");
              }
            }}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading exhibition details...</p>
        </div>
      </div>
    );
  }

  if (error || !exhibition) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Exhibition not found</p>
          <button
            onClick={() => navigate("/exhibitions")}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Back to Exhibitions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Image Gallery */}
        {exhibition.media?.length > 0 && (
          <div className="mb-12">
            <ImageCarousel images={exhibition.media} />
          </div>
        )}

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-4xl text-[#2F4138] mb-6">{exhibition.title}</h1>

          <div className="space-y-6">
            {/* Dates and Location */}
            <div className="flex flex-wrap gap-6 text-[#5C6760]">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {new Date(exhibition.startDate).toLocaleDateString()} –{" "}
                  {new Date(exhibition.endDate).toLocaleDateString()}
                </span>
              </div>
              {exhibition.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{exhibition.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg text-[#5C6760]">
              <p className="leading-relaxed">{exhibition.description}</p>
            </div>

            {/* Participants */}
            {exhibition.participants?.length > 0 && (
              <div className="border-t border-[#2F4138]/10 pt-6">
                <h2 className="font-display text-2xl text-[#2F4138] mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Featured Artists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exhibition.participants.map((participant, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      {participant.profileImage && (
                        <img
                          src={participant.profileImage}
                          alt={participant.name}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-[#2F4138]">{participant.name}</p>
                        {participant.role && (
                          <p className="text-sm text-[#5C6760]">{participant.role}</p>
                        )}
                        {participant.bio && (
                          <p className="text-sm text-[#5C6760] mt-1">{participant.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {exhibition.tags?.length > 0 && (
              <div className="border-t border-[#2F4138]/10 pt-6">
                <h3 className="font-display text-xl text-[#2F4138] mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exhibition.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#2F4138]/5 text-[#2F4138] rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleDeleteExhibition}
              className="group bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Exhibition</span>
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExhibitionDetailsPage;