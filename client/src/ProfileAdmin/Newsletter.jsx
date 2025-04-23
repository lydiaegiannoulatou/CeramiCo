import React, { useState } from "react";
import axios from "axios";

const NewsletterPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSendNewsletter = async () => {
    const token = localStorage.getItem("token");

    if (!subject || !message) {
      setStatus({ type: "error", msg: "Please fill out both fields." });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3050/admin/newsletter",
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus({ type: "success", msg: response.data.message || "Newsletter sent!" });
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending newsletter:", err);
      setStatus({ type: "error", msg: err.response?.data?.error || "Failed to send newsletter." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#fdfaf4] rounded-xl shadow-md">
      <h2 className="text-3xl font-serif text-center mb-6">Send a Newsletter</h2>

      {status && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm ${
            status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-2">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="e.g., Our Spring Collection is Here!"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="6"
          className="w-full border p-2 rounded"
          placeholder="Write your newsletter message here..."
        ></textarea>
      </div>

      <button
        onClick={handleSendNewsletter}
        className="bg-[#8b5e3c] hover:bg-[#734a2e] text-white px-6 py-2 rounded font-semibold"
      >
        Send Newsletter
      </button>
    </div>
  );
};

export default NewsletterPage;
