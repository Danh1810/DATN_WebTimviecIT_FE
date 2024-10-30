import React from "react";
import { useState } from "react";
import { ChevronDownIcon, BellIcon } from "@heroicons/react/20/solid";

const RegisterForm = () => {
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isOpportunityOpen, setIsOpportunityOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  return (
    <div>
      <nav className="bg-purple-700 text-white flex items-center justify-between p-4">
        {/* Left side (Logo) */}
        <div className="flex items-center space-x-4">
          <img
            src="https://example.com/logo.png"
            alt="Company Logo"
            className="h-8"
          />
          <span className="text-xl font-bold">việc làm 24h</span>
        </div>

        {/* Center (Menu Items) */}
        <div className="hidden md:flex space-x-8">
          {/* Menu Item 1 */}
          <div className="relative">
            <button
              onClick={() => setIsOpportunityOpen(!isOpportunityOpen)}
              className="flex items-center space-x-1"
            >
              <span>Cơ hội việc làm</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isOpportunityOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Job Opportunity 1
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Job Opportunity 2
                </a>
              </div>
            )}
          </div>

          {/* Menu Item 2 */}
          <div className="relative">
            <button
              onClick={() => setIsToolOpen(!isToolOpen)}
              className="flex items-center space-x-1"
            >
              <span>Công cụ</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isToolOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Tool 1
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Tool 2
                </a>
              </div>
            )}
          </div>

          {/* Additional Menu Item 3 */}
          <div className="relative">
            <button className="flex items-center space-x-1">
              <span>Thư viện</span>
            </button>
          </div>

          {/* Additional Menu Item 4 */}
          <div className="relative">
            <button className="flex items-center space-x-1">
              <span>Liên hệ</span>
            </button>
          </div>
        </div>

        {/* Right side (Icons and Region Selector) */}
        <div className="flex items-center space-x-6">
          {/* Region Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRegionOpen(!isRegionOpen)}
              className="flex items-center space-x-1"
            >
              <span>Miền Nam</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isRegionOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Miền Bắc
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Miền Trung
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Miền Nam
                </a>
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">
              8
            </span>
          </div>

          {/* User Role Selector */}
          <div className="flex items-center space-x-1">
            <span className="flex items-center space-x-1">
              <span>Dành cho</span>
              <span className="font-semibold">Nhà Tuyển Dụng</span>
            </span>
          </div>

          {/* Language Selector */}
          <img
            src="https://example.com/flag.png" // Replace with your flag image URL
            alt="English"
            className="h-6 w-6"
          />
        </div>
      </nav>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Đăng ký tài khoản nhà tuyển dụng
        </h2>

        {/* Thông tin tài khoản */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Điền họ và tên"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Điền số điện thoại"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Điền email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Điền mật khẩu"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Thông tin công ty */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Thông tin công ty</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Theo giấy phép kinh doanh
              </p>
              <input
                type="text"
                placeholder="Điền tên công ty"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Chọn tỉnh thành phố</option>
                {/* Thêm các tùy chọn khác ở đây */}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Lĩnh vực hoạt động
              </label>
              <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Chọn lĩnh vực</option>
                {/* Thêm các tùy chọn khác ở đây */}
              </select>
            </div>
          </div>
        </div>

        {/* Đăng nhập và nút hoàn thành đăng ký */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm">
            Bạn đã có tài khoản?{" "}
            <a href="#" className="text-blue-500 font-medium">
              Đăng nhập
            </a>
          </p>
          <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none">
            Hoàn thành đăng ký
          </button>
        </div>

        <p className="mt-4 text-xs text-center">
          Bằng việc nhấn nút đăng ký, bạn đã đồng ý với{" "}
          <a href="#" className="text-blue-500">
            Điều khoản sử dụng
          </a>{" "}
          của Việc Làm 24h
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
