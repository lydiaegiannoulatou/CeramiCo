import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, Users, Loader2, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkshopPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get("http://localhost:3050/workshops");
      setWorkshops(response.data);
    } catch (err) {
      console.error("Failed to fetch workshops", err);
      toast.error("Failed to load workshops. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent navigation
    
    if (!window.confirm("Are you sure you want to delete this workshop?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3050/workshops/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Workshop deleted successfully");
      fetchWorkshops(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete workshop:", err);
      toast.error("Failed to delete workshop. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (!workshops.length) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calendar className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">No workshops available</p>
          <p className="text-[#5C6760]">Check back later for new workshops</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-[#2F4138] mb-4">
            Available Workshops
          </h1>
          <div className="h-1 w-32 bg-[#2F4138]/20 rounded-full mx-auto"></div>
        </div>

        {/* Workshop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <Link
              to={`/workshops/${workshop._id}`}
              key={workshop._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative"
            >
              {/* Admin Controls */}
              {role === "admin" && (
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <Link
                    to={`/admin/workshops/edit/${workshop._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(workshop._id, e)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Image Container */}
              <div className="aspect-video relative overflow-hidden bg-[#2F4138]/5">
                {workshop.image ? (
                  <img
                    src={workshop.image}
                    alt={workshop.title}
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
                  {workshop.title}
                </h2>
                
                <p className="text-[#5C6760] mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {workshop.instructor}
                </p>
                
                <p className="text-[#5C6760] flex-grow">
                  {workshop.description.length > 120
                    ? `${workshop.description.slice(0, 120)}...`
                    : workshop.description}
                </p>

                {/* Price and Details */}
                <div className="mt-6 pt-4 border-t border-[#2F4138]/10 flex justify-between items-center">
                  <span className="font-medium text-[#2F4138]">€{workshop.price}</span>
                  <span className="text-sm text-[#5C6760] group-hover:text-[#2F4138] transition-colors duration-200">
                    View Details →
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

export default WorkshopPage;