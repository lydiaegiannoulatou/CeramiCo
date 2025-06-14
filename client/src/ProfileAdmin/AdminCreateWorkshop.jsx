import React, { useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload";
import { Calendar, Clock, Users, Send, Image, Loader2, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCreateWorkshop = () => {
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "",
    duration: "",
    startDate: "",
    recurringPattern: "weekly",
    recurringTime: "",
    maxSpots: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (uploadedImages) => {
    if (uploadedImages.length > 0) {
      setFormData((prev) => ({ ...prev, image: uploadedImages[0] }));
    }
  };

  const generateRecurringDates = (startDate, durationMonths, recurringPattern) => {
    const dates = [];
    let currentDate = new Date(startDate);

    const [hour, minute] = formData.recurringTime.split(":");
    currentDate.setHours(hour, minute);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));

      if (recurringPattern === "weekly") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (recurringPattern === "bi-weekly") {
        currentDate.setDate(currentDate.getDate() + 14);
      } else if (recurringPattern === "monthly") {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.duration) {
      toast.error("Please select the duration of the workshop.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
      setIsSubmitting(false);
      return;
    }

    const recurringDates = generateRecurringDates(
      formData.startDate,
      Number(formData.duration),
      formData.recurringPattern
    );

    const workshopData = {
      ...formData,
      price: Number(formData.price),
      maxSpots: Number(formData.maxSpots),
      sessions: recurringDates,
    };

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${baseUrl}/workshops/new_class`,
        workshopData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Workshop created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
        setFormData({
          title: "",
          instructor: "",
          description: "",
          price: "",
          duration: "",
          startDate: "",
          recurringPattern: "weekly",
          recurringTime: "17:00",
          maxSpots: "",
          image: "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create workshop. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">Basic Information</h3>
          
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>
          </div>
        </div>

        {/* Schedule and Pricing */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">Schedule and Pricing</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Recurring Time
              </label>
              <input
                type="time"
                name="recurringTime"
                value={formData.recurringTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              >
                <option value="">Select Duration</option>
                <option value="1">1 month</option>
                <option value="2">2 months</option>
                <option value="3">3 months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                Recurring Pattern
              </label>
              <select
                name="recurringPattern"
                value={formData.recurringPattern}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">
            <Image className="w-4 h-4 inline mr-2" />
            Workshop Image
          </h3>
          <CloudinaryUpload onImagesUploaded={handleImageUpload} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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
                Creating Workshop...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Create Workshop
              </>
            )}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminCreateWorkshop;