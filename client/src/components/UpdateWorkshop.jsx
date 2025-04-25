import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CloudinaryUpload from "./CloudinaryUpload";
import { Calendar, Clock, Users, Save, Image, Loader2, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateWorkshop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "",
    maxSpots: "",
    image: "",
  });

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3050/workshops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const workshop = response.data;
        setFormData({
          title: workshop.title || "",
          instructor: workshop.instructor || "",
          description: workshop.description || "",
          price: workshop.price || "",
          maxSpots: workshop.maxSpots || "",
          image: workshop.image || "",
        });
      } catch (err) {
        console.error("Error fetching workshop:", err);
        toast.error("Failed to load workshop details", {
          position: "top-right",
          autoClose: 5000,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        });
        navigate("/workshops");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (uploadedImages) => {
    if (uploadedImages.length > 0) {
      setFormData((prev) => ({ ...prev, image: uploadedImages[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3050/workshops/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Workshop updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
        navigate("/workshops");
      }
    } catch (err) {
      console.error("Error updating workshop:", err);
      toast.error("Failed to update workshop. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F2EB]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xl font-medium text-[#2F4138] mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2F4138] mb-2">
                  Workshop Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter workshop title"
                  className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
                    placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2F4138] mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  placeholder="Enter instructor name"
                  className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
                    placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2F4138] mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter workshop description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
                    placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Price and Capacity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-medium text-[#2F4138] mb-4">Price and Capacity</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2F4138] mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Price (€)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
                    placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2F4138] mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maximum Spots
                </label>
                <input
                  type="number"
                  name="maxSpots"
                  value={formData.maxSpots}
                  onChange={handleChange}
                  placeholder="Enter maximum spots"
                  className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
                    placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-medium text-[#2F4138] mb-4">
              <Image className="w-4 h-4 inline mr-2" />
              Workshop Image
            </h3>
            
            {formData.image && (
              <div className="mb-4">
                <p className="text-sm text-[#2F4138] mb-2">Current Image:</p>
                <img
                  src={formData.image}
                  alt="Current workshop"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            
            <CloudinaryUpload onImagesUploaded={handleImageUpload} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/workshops")}
              className="px-6 py-3 rounded-xl bg-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138]/20
                transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-[#2F4138] text-white rounded-xl
                hover:bg-[#3A4F44] disabled:bg-[#2F4138]/20 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Workshop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateWorkshop;