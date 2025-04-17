import React, { useEffect, useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload";

const AdminExhibitionModal = ({ onClose, onExhibitionCreated, existingData }) => {
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
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

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
        response = await axios.put(
          `http://localhost:3050/exhibitions/${existingData._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          "http://localhost:3050/exhibitions/add",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (onExhibitionCreated) onExhibitionCreated(response.data);
      onClose();
    } catch (err) {
      console.error("Error saving exhibition:", err);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
     <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-xl">×</button>
        <h2 className="text-xl font-semibold mb-4">
          {existingData ? "Edit Exhibition" : "Create Exhibition"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />

          {/* Dates */}
          <div className="flex gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-1/2 p-2 border rounded"
            />
          </div>

          {/* Location */}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
          />

          {/* Tags */}
          <input
            type="text"
            value={formData.tags.join(", ")}
            onChange={handleTagChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border rounded"
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
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                value={participant.role}
                onChange={(e) => setParticipant({ ...participant, role: e.target.value })}
                placeholder="Role"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="bg-blue-500 text-white px-3 rounded"
              >
                Add
              </button>
            </div>

            {/* List of participants */}
            <ul className="mt-2 space-y-1 text-sm">
              {formData.participants.map((p, index) => (
                <li key={index} className="flex justify-between items-center">
                  {p.name} – {p.role}
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => {
                        setParticipant(p);
                        setFormData((prev) => ({
                          ...prev,
                          participants: prev.participants.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-blue-500 hover:underline"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          participants: prev.participants.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-red-500 hover:underline"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Existing media */}
          {formData.media.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Existing Images</h4>
              <div className="flex flex-wrap gap-2">
                {formData.media.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`Exhibition ${idx}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.media];
                        updated.splice(idx, 1);
                        setFormData((prev) => ({ ...prev, media: updated }));
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="mt-4">
            <CloudinaryUpload onImagesUploaded={handleImageUpload} />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              {existingData ? "Update" : "Create"} Exhibition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminExhibitionModal;
