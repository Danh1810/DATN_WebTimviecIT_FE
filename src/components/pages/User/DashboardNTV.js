import React, { useState } from "react";
import ProfileForm from "../Profile";
import CVManagement from "./hoso";

const DashboardNTV = () => {
  const [selectedMenu, setSelectedMenu] = useState("Overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (selectedMenu) {
      case "profile":
        return <ProfileForm />;
      case "Kynang":
        return <CVManagement />;
      case "Overview":
        return <h3 className="text-lg font-semibold mb-2">Người tìm việc</h3>;
      default:
        return <p>Content not available</p>;
    }
  };

  const handleMenuClick = (menuKey) => {
    setSelectedMenu(menuKey);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false); // Close the mobile menu after selection
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => (window.location.href = "/home")}
              className="flex-shrink-0"
            >
              <span className="text-red-600 font-bold text-lg">
                Việc làm IT
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {[
                { key: "Overview", label: "Tổng quan" },
                { key: "profile", label: "Thông tin cá nhân" },
                { key: "Kynang", label: "Hồ sơ cá nhân" },
                { key: "ntd", label: "Việc làm đã ứng tuyển" },
                { key: "quyen", label: "Việc làm đã lưu" },
                { key: "lstt", label: "Lịch sử thanh toán" },
              ].map((menu) => (
                <button
                  key={menu.key}
                  href="#"
                  onClick={() => handleMenuClick(menu.key)}
                  className={`text-gray-700 hover:text-red-600 font-medium ${
                    selectedMenu === menu.key ? "text-red-600" : ""
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">{renderContent()}</main>
    </div>
  );
};

export default DashboardNTV;
