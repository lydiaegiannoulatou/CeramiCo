import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import UserOrders from "./UserOrders";
import UserBookings from "./UserBookings";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try { 
          const response = await axios.get(`http://localhost:3050/user/profile/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setProfile(response.data); 
        } catch (err) {
          setError("Failed to fetch profile data.",err);
        } finally {
          setLoading(false); 
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // 
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  return (
    <div className="min-h-screen flex bg-[#f9f5ef]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#e9dccd] p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#4b3b2a]">User Menu</h2>
        <ul className="space-y-3">
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "info" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            My Info
          </li>
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "orders" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </li>
          <li
            className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
              activeTab === "bookings" ? "bg-[#d7bb95] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            My Workshops
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl p-6 shadow">
          {activeTab === "info" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Info</h2>
              <p><strong>Name:</strong> {profile.name}</p> 
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Username:</strong> {profile.username}</p>
            </div>
          )}
          {activeTab === "orders" && <UserOrders token={localStorage.getItem("token")} />}
          {activeTab === "bookings" && <UserBookings token={localStorage.getItem("token")} />}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
