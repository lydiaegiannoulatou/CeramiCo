import React, { useState } from "react";
import axios from "axios";
import CloudinaryUpload from "../components/CloudinaryUpload"; // Import Cloudinary Upload Component

const AdminCreateWorkshop = () => {
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    price: "",
    duration: "", // No default duration
    startDate: "", // Start Date and Time
    recurringPattern: "weekly", // Default recurring pattern
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

  // Function to generate the recurring dates based on recurring pattern
  const generateRecurringDates = (startDate, durationMonths, recurringPattern) => {
    const dates = [];
    let currentDate = new Date(startDate);

    // Set the start time to the selected recurring time
    const [hour, minute] = formData.recurringTime.split(":");
    currentDate.setHours(hour, minute);

    // Calculate the end date by adding the duration (in months) to the start date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Loop through the recurring pattern and add sessions
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));

      // Set the next date based on the selected recurring pattern
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
    setMessage(null);

    // Validate duration field is not empty
    if (!formData.duration) {
      setMessage("Please select the duration of the workshop.");
      return;
    }

    // Generate recurring sessions based on selected pattern and duration
    const recurringDates = generateRecurringDates(
      formData.startDate,
      Number(formData.duration),
      formData.recurringPattern
    );

    // Prepare the form data for submission
    const workshopData = {
      ...formData,
      price: Number(formData.price), // Convert to number
      maxSpots: Number(formData.maxSpots), // Convert to number
      sessions: recurringDates, // Include the generated sessions
    };

    const token = localStorage.getItem('token');
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
        duration: "", // Reset duration
        startDate: "",
        recurringPattern: "weekly", // Reset to default recurring pattern
        recurringTime: "17:00", // Reset to default time
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

        {/* Duration Dropdown */}
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Duration</option>
          <option value="1">1 month</option>
          <option value="2">2 months</option>
          <option value="3">3 months</option>
        </select>

        {/* Start Date with Time */}
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Recurring Pattern */}
        <select
          name="recurringPattern"
          value={formData.recurringPattern}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Recurring Time */}
        <input
          type="time"
          name="recurringTime"
          value={formData.recurringTime}
          onChange={handleChange}
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
