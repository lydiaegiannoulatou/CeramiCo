import React, { useEffect, useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload";
import { Calendar, MapPin, Tag, Users, Send, Loader2, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminExhibitionPage = ({ existingData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    tags: [],
    participants: [],
    media: [],
  });

  const [participant, setParticipant] = useState({ name: "", role: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title || "",
        description: existingData.description || "",
        startDate: existingData.startDate?.slice(0, 10) || "",
        endDate: existingData.endDate?.slice(0, 10) || "",
        location: existingData.location || "",
        tags: existingData.tags || [],
        participants: existingData.participants || [],
        media: existingData.media || [],
      });
    }
  }, [existingData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleAddParticipant = () => {
    if (participant.name && participant.role) {
      setFormData((prev) => ({
        ...prev,
        participants: [...prev.participants, participant],
      }));
      setParticipant({ name: "", role: "" });
    }
  };

  const handleRemoveParticipant = (index) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (images) => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...images],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      let response;
      if (existingData) {
        response = await axios.put(
          `${baseUrl}/exhibitions/${existingData._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Exhibition updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
      } else {
        response = await axios.post(
          `${baseUrl}/exhibitions/add`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Exhibition created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
      }

      // Reset form after successful submission if creating new exhibition
      if (!existingData) {
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
          tags: [],
          participants: [],
          media: [],
        });
      }
    } catch (err) {
      console.error("Error saving exhibition:", err);
      toast.error("Failed to save exhibition.", {
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                Exhibition Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter exhibition title"
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
                onChange={handleInputChange}
                placeholder="Enter exhibition description"
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates and Location */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">Dates and Location</h3>
          
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2F4138] mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter exhibition location"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">
            <Tag className="w-4 h-4 inline mr-2" />
            Tags
          </h3>
          
          <input
            type="text"
            value={formData.tags.join(", ")}
            onChange={handleTagChange}
            placeholder="Enter tags separated by commas"
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
              placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
          />
          
          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#2F4138]/10 text-[#2F4138] rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">
            <Users className="w-4 h-4 inline mr-2" />
            Participants
          </h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={participant.name}
                onChange={(e) => setParticipant({ ...participant, name: e.target.value })}
                placeholder="Participant name"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
              />
              <input
                type="text"
                value={participant.role}
                onChange={(e) => setParticipant({ ...participant, role: e.target.value })}
                placeholder="Role"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                disabled={!participant.name || !participant.role}
                className="px-4 py-3 rounded-xl bg-[#2F4138] text-white hover:bg-[#3A4F44] 
                  disabled:bg-[#2F4138]/20 disabled:text-white/50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.participants.length > 0 && (
              <div className="space-y-2">
                {formData.participants.map((p, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#2F4138]/10"
                  >
                    <div>
                      <p className="font-medium text-[#2F4138]">{p.name}</p>
                      <p className="text-sm text-[#2F4138]/70">{p.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(index)}
                      className="p-1 hover:bg-[#2F4138]/10 rounded-full transition-colors duration-200"
                    >
                      <AlertCircle className="w-5 h-5 text-[#2F4138]/70" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-[#2F4138]/5 rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#2F4138] mb-4">Exhibition Images</h3>
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
                Saving...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {existingData ? "Update" : "Create"} Exhibition
              </>
            )}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminExhibitionPage;