import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import UserOrders from "./UserOrders";
import UserBookings from "./UserBookings";
import { User, Package, Calendar, Mail, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const baseUrl = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await axios.get(`${baseUrl}/user/profile/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setProfile(response.data);
        } catch (err) {
          setError("Failed to fetch profile data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#2F4138] animate-spin" />
          <p className="text-[#2F4138] text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#2F4138] text-white rounded-full hover:bg-[#3A4F44] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-[#2F4138]/50 mx-auto" />
          <p className="text-[#2F4138] text-xl font-medium">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5F2EB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2F4138] p-6 text-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-medium text-center">{profile.name}</h2>
          <p className="text-white/70 text-center text-sm mt-1">{profile.email}</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
              activeTab === "info"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            My Info
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
              activeTab === "orders"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Package className="w-5 h-5 mr-3" />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
              activeTab === "bookings"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            My Workshops
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {activeTab === "info" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display text-[#2F4138] mb-6">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#5C6760]">Full Name</label>
                      <div className="flex items-center space-x-3 p-3 bg-[#2F4138]/5 rounded-lg">
                        <User className="w-5 h-5 text-[#2F4138]" />
                        <span className="text-[#2F4138]">{profile.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#5C6760]">Email Address</label>
                      <div className="flex items-center space-x-3 p-3 bg-[#2F4138]/5 rounded-lg">
                        <Mail className="w-5 h-5 text-[#2F4138]" />
                        <span className="text-[#2F4138]">{profile.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#5C6760]">Username</label>
                      <div className="flex items-center space-x-3 p-3 bg-[#2F4138]/5 rounded-lg">
                        <User className="w-5 h-5 text-[#2F4138]" />
                        <span className="text-[#2F4138]">{profile.username}</span>
                      </div>
                    </div>

                    {profile.phone && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#5C6760]">Phone Number</label>
                        <div className="flex items-center space-x-3 p-3 bg-[#2F4138]/5 rounded-lg">
                          <Phone className="w-5 h-5 text-[#2F4138]" />
                          <span className="text-[#2F4138]">{profile.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {profile.address && (
                  <div>
                    <h2 className="text-2xl font-display text-[#2F4138] mb-6">Address Information</h2>
                    <div className="p-4 bg-[#2F4138]/5 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-[#2F4138] mt-1" />
                        <div className="space-y-1">
                          <p className="text-[#2F4138]">{profile.address.street}</p>
                          <p className="text-[#2F4138]">
                            {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                          </p>
                          <p className="text-[#2F4138]">{profile.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && <UserOrders token={localStorage.getItem("token")} />}
            {activeTab === "bookings" && <UserBookings token={localStorage.getItem("token")} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;