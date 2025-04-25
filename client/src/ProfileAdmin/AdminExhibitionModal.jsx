import React, { useEffect, useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload";
import ToastNotification from "../components/ToastNotification"; 

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

  const handleImageUpload = (images) => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...images],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let response;
      if (existingData) {
        // Updating an existing exhibition
        response = await axios.put(
          `http://localhost:3050/exhibitions/${existingData._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        ToastNotification.notifySuccess("Exhibition updated successfully!");
      } else {
        // Creating a new exhibition
        response = await axios.post(
          "http://localhost:3050/exhibitions/add",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        ToastNotification.notifySuccess("Exhibition created successfully!");
      }

      console.log(response.data);  // Handle the created or updated exhibition response

    } catch (err) {
      console.error("Error saving exhibition:", err);
      ToastNotification.notifyError("Failed to save exhibition.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">
        {existingData ? "Edit Exhibition" : "Create Exhibition"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Exhibition Title"
          className="p-3 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Exhibition Description"
          className="p-3 border rounded"
        />

        {/* Dates */}
        <div className="flex gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="p-3 border rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="p-3 border rounded"
          />
        </div>

        {/* Location */}
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Exhibition Location"
          className="p-3 border rounded"
        />

        {/* Tags */}
        <input
          type="text"
          value={formData.tags.join(", ")}
          onChange={handleTagChange}
          placeholder="Tags (comma-separated)"
          className="p-3 border rounded"
        />

        {/* Participants */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-1">Add Participant</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={participant.name}
              onChange={(e) => setParticipant({ ...participant, name: e.target.value })}
              placeholder="Name"
              className="flex-1 p-3 border rounded"
            />
            <input
              type="text"
              value={participant.role}
              onChange={(e) => setParticipant({ ...participant, role: e.target.value })}
              placeholder="Role"
              className="flex-1 p-3 border rounded"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <CloudinaryUpload onImagesUploaded={handleImageUpload} />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            {existingData ? "Update" : "Create"} Exhibition
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminExhibitionPage;
