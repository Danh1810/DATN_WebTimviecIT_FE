import React, { useState } from "react";
import ProfileForm from "../Profile"; //
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
      //   case "ntd":
      //     return <EmployerManagement />;
      //   case "ntv":
      //     return <JobSeekerManagement />;
      //   case "nd":
      //     return <UserManagement />;
      //   case "quyen":
      //     return <RoleManagement />;
      //   case "thanhtoan":
      //     return <PaymentTypeManagement />;
      //   case "lstt":
      //     return <PaymentHistory />;
      //   case "ung":
      //     return <JobApplicationForm />;
      //   case "Phongvan":
      //     return <InterviewChat />;
      //   case "vttt":
      //     return <UserList />;
      //   case "ttd":
      //     return <App />;
      //   case "kntt":
      //     return <JobPostSkills />;
      case "Overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Users</h3>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-green-500">+12% from last month</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Revenue</h3>
              <p className="text-2xl font-bold">$12,456</p>
              <p className="text-green-500">+5% from last month</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p className="text-2xl font-bold">345</p>
              <p className="text-red-500">-3% from last month</p>
            </div>
          </div>
        );
      default:
        return <p>Content not available</p>;
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-red-600 font-bold text-lg">TopDev CV</span>
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
                  onClick={() => setSelectedMenu(menu.key)}
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

        {/* Mobile Navigation */}
      </nav>

      {/* Main Content */}
      <main className="p-4">{renderContent()}</main>
    </div>
  );
};

export default DashboardNTV;
