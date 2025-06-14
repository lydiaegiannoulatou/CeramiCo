import React, { useState } from "react";
import axios from "axios";
import { Send, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const NewsletterPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSendNewsletter = async () => {
    if (!subject || !message) {
      setStatus({ type: "error", msg: "Please fill out both fields." });
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${baseUrl}/admin/newsletter`,
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus({ type: "success", msg: response.data.message || "Newsletter sent successfully!" });
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending newsletter:", err);
      setStatus({ type: "error", msg: err.response?.data?.error || "Failed to send newsletter." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {status && (
        <div className={`flex items-center p-4 rounded-xl ${
          status.type === "success" 
            ? "bg-[#EDF7ED] text-[#2F4138]" 
            : "bg-[#FBEAEA] text-[#D32F2F]"
        }`}>
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          )}
          {status.msg}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2F4138] mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
              placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20
              transition-all duration-200"
            placeholder="e.g., New Spring Collection Available Now"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2F4138] mb-2">
            Message Content
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="8"
            className="w-full px-4 py-3 rounded-xl bg-[#2F4138]/5 border border-[#2F4138]/10 
              placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20
              transition-all duration-200 resize-none"
            placeholder="Write your newsletter message here..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-4">
        <button
          onClick={handleSendNewsletter}
          disabled={isProcessing || !subject || !message}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200
            ${isProcessing || !subject || !message
              ? "bg-[#2F4138]/20 text-[#2F4138]/50 cursor-not-allowed"
              : "bg-[#2F4138] text-white hover:bg-[#3A4F44]"
            }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Newsletter
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewsletterPage;