import React from "react";
import { useNavigate } from "react-router-dom";

const adminSections = [
  {
    title: "Products",
    description: "Go to the shop page to update the eShop",
    route: "/shop",
  },
  {
    title: "Workshops",
    description: "Go to the workshop page to update workshops",
    route: "/workshops",
  },
  {
    title: "Exhibitions",
    description: "Manage exhibitions",
    route: "/exhibitions",
  }, 
  {
    title: "Orders",
    description: "Accept, decline orders. Update status",
    route: "/admin/orders",
  },
  {
    title: "Bookings",
    description: "Accept or Decline bookings",
    route: "/admin/bookings",
  },
 
  {
    title: "Newsletter",
    description: "Send a newsletter",
    route: "/admin/newsletter",
  },
];

const AdminProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-serif text-center mb-10 text-[#4b3b2a]">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {adminSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-[#f3ead7] hover:bg-[#eee2c8] cursor-pointer rounded-xl p-6 shadow-md text-center transition duration-200 ease-in-out"
            onClick={() => navigate(section.route)}
          >
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-gray-700">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
