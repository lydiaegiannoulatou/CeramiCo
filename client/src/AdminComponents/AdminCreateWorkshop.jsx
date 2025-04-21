import React, { useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload"; // Import Cloudinary Upload Component

const AdminCreateWorkshop = () => {
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "",
    duration: "",
    startDate: "", // Start Date
    recurringTime: "17:00", // Default recurring time (can be adjusted)
    maxSpots: "",
    image: "", // For image URL from Cloudinary
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (uploadedImages) => {
    // Set the image URL from the Cloudinary upload response
    if (uploadedImages.length > 0) {
      setFormData((prev) => ({ ...prev, image: uploadedImages[0] }));
    }
  };

  // Function to generate the recurring dates
  const generateRecurringDates = (startDate, durationMonths, recurringTime) => {
    const dates = [];
    let currentDate = new Date(startDate);

    // Set the start time to 17:00 for each session
    const [hour, minute] = recurringTime.split(":");
    currentDate.setHours(hour, minute);

    // Calculate the end date by adding the duration (in months) to the start date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Loop through the dates and add each Monday
    while (currentDate <= endDate) {
      // Add current date to the array
      dates.push(new Date(currentDate));
      // Move to the next Monday
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Generate recurring sessions
    const recurringDates = generateRecurringDates(
      formData.startDate,
      2, // 2 months duration for the workshop
      formData.recurringTime
    );

    // Prepare the form data for submission
    const workshopData = {
      ...formData,
      price: Number(formData.price), // Convert to number
      maxSpots: Number(formData.maxSpots), // Convert to number
      sessions: recurringDates, // Include the generated sessions
    };
const token = localStorage.getItem('token')
try {
  const res = await axios.post(
    "http://localhost:3050/workshops/new_class",
    workshopData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
    }
  );

      if (res.status !== 201) throw new Error("Failed to create workshop");

      setMessage("Workshop created successfully!");
      setFormData({
        title: "",
        instructor: "",
        description: "",
        price: "",
        duration: "",
        startDate: "",
        recurringTime: "17:00",
        maxSpots: "",
        image: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create a New Workshop</h2>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Workshop Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="instructor"
          placeholder="Instructor Name"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Workshop Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (€)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 2 months)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="recurringTime"
          value={formData.recurringTime}
          onChange={handleChange}
          placeholder="Recurring Time (e.g., 17:00)"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="maxSpots"
          placeholder="Max Spots"
          value={formData.maxSpots}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Cloudinary image upload */}
        <CloudinaryUpload onImagesUploaded={handleImageUpload} />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create Workshop
        </button>
      </form>
    </div>
  );
};

export default AdminCreateWorkshop;
