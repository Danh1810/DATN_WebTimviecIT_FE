import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../services/auth/logout";
import { logout } from "../slice/authSlice";

function Layout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const [selectedMenu, setSelectedMenu] = useState("");

  const handleMenuClick = (menuKey) => {
    setSelectedMenu(menuKey);
    navigate(menuKey);
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
                { key: "/profile", label: "Thông tin cá nhân" },
                { key: "/hoso", label: "Hồ sơ cá nhân" },
                { key: "/vieclamut", label: "Việc làm đã ứng tuyển" },
                { key: "/luucv", label: "Việc làm đã lưu" },
                // { key: "/lstt", label: "Lịch sử thanh toán" },
              ].map((menu) => (
                <button
                  key={menu.key}
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
      <main className="p-4">{children}</main>
    </div>
  );
}

export default Layout;
