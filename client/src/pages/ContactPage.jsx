import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Sending your message...', {
      position: "top-right",
      autoClose: 2000
    });
    
    try {
      const response = await axios.post('http://localhost:3050/newsletter/contact', formData);
      if (response.status === 200) {
        toast.success('Message sent successfully!', {
          position: "top-right",
          autoClose: 5000
        });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error('Error sending message. Please try again.', {
        position: "top-right",
        autoClose: 5000
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-[#D4C8B8]">
        <h1 className="text-4xl font-bold text-center text-[#2F4138] mb-8">Get in Touch</h1>
        <div className="text-lg space-y-6 text-[#5C6760]">
          <p className="text-center">
            We would love to hear from you! Share your thoughts, questions, or ideas with us.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="flex items-center text-lg font-medium text-[#2F4138] mb-2">
                <User size={20} className="mr-2" />
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#D4C8B8] rounded-lg bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#2F4138] focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="flex items-center text-lg font-medium text-[#2F4138] mb-2">
                <Mail size={20} className="mr-2" />
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#D4C8B8] rounded-lg bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#2F4138] focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="message" className="flex items-center text-lg font-medium text-[#2F4138] mb-2">
                <MessageSquare size={20} className="mr-2" />
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-[#D4C8B8] rounded-lg bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#2F4138] focus:border-transparent"
                rows="5"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-4 bg-[#2F4138] text-white rounded-lg hover:bg-[#3A4F44] transition duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Send Message</span>
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactPage;