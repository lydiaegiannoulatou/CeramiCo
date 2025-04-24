import React, { useState } from "react";
import AdminCreateWorkshop from "./AdminCreateWorkshop";
import Newsletter from "./Newsletter";
import AdminExhibitionModal from "./AdminExhibitionModal";
import AddProductModal from "./AddProductModal";
import ProductOrdersManagement from "./ProductOrdersManagement";
import WorkshopBookingsManagement from "./WorkshopBookingsManagement";
import GalleryAdmin from "./GalleryAdmin";

const adminSections = [
  { key: "orders", title: "Product Orders" },
  { key: "bookings", title: "Workshop Bookings" },
  { key: "products", title: "Add Product" },
  { key: "createWorkshop", title: "Add Workshop" },
  { key: "exhibitions", title: "Add Exhibition" },
  { key: "newsletter", title: "Newsletter" },
  { key: "gallery", title: "Gallery" },
];

const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState("orders");

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <ProductOrdersManagement />; // Order management component
      case "bookings":
        return <WorkshopBookingsManagement />; // Booking management component
      case "products":
        return <AddProductModal />;
      case "createWorkshop":
        return <AdminCreateWorkshop />;
      case "exhibitions":
        return <AdminExhibitionModal />; // Exhibition management modal or component
      case "newsletter":
        return <Newsletter />;
      case "gallery":
        return <GalleryAdmin />;
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f9f5ef]">
      {/* Sidebar */}
      <div className="w-64 bg-[#e9dccd] p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#4b3b2a]">Admin</h2>
        <ul className="space-y-3">
          {adminSections.map((section) => (
            <li
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`cursor-pointer p-2 rounded hover:bg-[#e4cfa4] transition ${
                activeSection === section.key
                  ? "bg-[#d7bb95] font-semibold"
                  : ""
              }`}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-serif text-[#4b3b2a] mb-4 capitalize">
          {adminSections.find((s) => s.key === activeSection)?.title}
        </h1>
        <div className="bg-white rounded-xl shadow p-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminProfile;
