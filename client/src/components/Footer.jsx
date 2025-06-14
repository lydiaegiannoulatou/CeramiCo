import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 

const Footer = () => {
  const [email, setEmail] = useState("");
const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/newsletter/subscribe`, { email });

      toast.success(response.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Failed to subscribe.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <footer className="bg-[#2F4138] text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Social Media Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 border-b border-white/20 pb-2">Connect with Social</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="text-white hover:text-gray-400">Facebook</a>
                <a href="https://twitter.com" className="text-white hover:text-gray-400">Twitter</a>
                <a href="https://instagram.com" className="text-white hover:text-gray-400">Instagram</a>
                <a href="https://youtube.com" className="text-white hover:text-gray-400">YouTube</a>
              </div>
            </div>

            {/* Subscribe Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 border-b border-white/20 pb-2">Subscribe</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white/10 text-white border border-white/20 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded flex items-center justify-center transition-colors duration-200"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-start md:justify-end">
            <nav className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link to="/faq" className="text-white/90 hover:text-white font-medium text-lg transition-colors duration-200">FAQ</Link>
              <Link to="/about" className="text-white/90 hover:text-white font-medium text-lg transition-colors duration-200">About</Link>
              <Link to="/contact" className="text-white/90 hover:text-white font-medium text-lg transition-colors duration-200">Contact Us</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-white/20 text-white/60 text-sm flex flex-col md:flex-row justify-between">
          <p>&copy; {new Date().getFullYear()} CeramiCo - Created by Lydia Elli Giannoulatou. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
