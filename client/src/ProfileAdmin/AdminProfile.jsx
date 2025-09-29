import React, { useState } from "react";
import AdminCreateWorkshop from "./AdminCreateWorkshop";
import Newsletter from "./Newsletter";
import AdminExhibitionModal from "./AdminExhibitionModal";
import AddProductModal from "./AddProductModal";
import ProductOrdersManagement from "./ProductOrdersManagement";
import WorkshopBookingsManagement from "./WorkshopBookingsManagement";
import GalleryAdmin from "./GalleryAdmin";
import { ShieldCheck, Package, Calendar, Mail, Image, PlusCircle, Bell, ShoppingBag, Menu, X } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  return (
    <div className="min-h-screen flex bg-[#F5F2EB]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2F4138] p-4 sm:p-6 text-white transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-lg sm:text-xl font-medium text-center">Admin Dashboard</h2>
          <p className="text-white/70 text-center text-xs sm:text-sm mt-1">System Administrator</p>
        </div>

        <nav className="space-y-1 sm:space-y-2">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => handleSectionChange(section.key)}
                className={`w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base ${
                  activeSection === section.key
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="truncate">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-[#2F4138]/10 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#2F4138]/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-[#2F4138]" />
          </button>
          <h1 className="text-lg font-medium text-[#2F4138] truncate">
            {adminSections.find((s) => s.key === activeSection)?.title}
          </h1>
          <div className="w-9 h-9" /> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
              {/* Desktop Header */}
              <h1 className="hidden lg:block text-xl sm:text-2xl font-display text-[#2F4138] mb-4 sm:mb-6">
                {adminSections.find((s) => s.key === activeSection)?.title}
              </h1>
              {renderSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;