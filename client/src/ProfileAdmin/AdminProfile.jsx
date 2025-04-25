import React, { useState } from "react";
import AdminCreateWorkshop from "./AdminCreateWorkshop";
import Newsletter from "./Newsletter";
import AdminExhibitionModal from "./AdminExhibitionModal";
import AddProductModal from "./AddProductModal";
import ProductOrdersManagement from "./ProductOrdersManagement";
import WorkshopBookingsManagement from "./WorkshopBookingsManagement";
import GalleryAdmin from "./GalleryAdmin";
import { ShieldCheck, Package, Calendar, Mail, Image, PlusCircle, Bell, ShoppingBag } from "lucide-react";

const adminSections = [
  { key: "orders", title: "Product Orders", icon: ShoppingBag },
  { key: "bookings", title: "Workshop Bookings", icon: Calendar },
  { key: "products", title: "Add Product", icon: Package },
  { key: "createWorkshop", title: "Add Workshop", icon: PlusCircle },
  { key: "exhibitions", title: "Add Exhibition", icon: Image },
  { key: "newsletter", title: "Newsletter", icon: Bell },
  { key: "gallery", title: "Gallery", icon: Image },
];

const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState("orders");

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <ProductOrdersManagement />;
      case "bookings":
        return <WorkshopBookingsManagement />;
      case "products":
        return <AddProductModal />;
      case "createWorkshop":
        return <AdminCreateWorkshop />;
      case "exhibitions":
        return <AdminExhibitionModal />;
      case "newsletter":
        return <Newsletter />;
      case "gallery":
        return <GalleryAdmin />;
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F2EB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2F4138] p-6 text-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-medium text-center">Admin Dashboard</h2>
          <p className="text-white/70 text-center text-sm mt-1">System Administrator</p>
        </div>

        <nav className="space-y-2">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
                  activeSection === section.key
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {section.title}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-display text-[#2F4138] mb-6">
              {adminSections.find((s) => s.key === activeSection)?.title}
            </h1>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;