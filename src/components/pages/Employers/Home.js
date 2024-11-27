import React from "react";
import { useState } from "react";
import { ChevronDownIcon, BellIcon } from "@heroicons/react/20/solid";
import { Logout } from "../../services/auth/logout";
import { logout } from "../../slice/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import App from "./ThemTin";
import EmployerManagement from "./ThongtinNTD";
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const [selectedMenu, setSelectedMenu] = useState("Overview");
  const [showAnalyticsSubNav, setShowAnalyticsSubNav] = useState(false);
  const [showReportsSubNav, setShowReportsSubNav] = useState(false);
  const handleLogout = async () => {
    const res = await Logout();
    console.log("db", res);
    if (+res.code === 0) {
      localStorage.removeItem("token");
      localStorage.setItem("isAuth", false);
      localStorage.setItem("prePath", location.pathname);
      localStorage.setItem("username", "");
      localStorage.setItem("group_id", "");
      localStorage.setItem("role", "");
      localStorage.setItem("preRole", auth.role);
      dispatch(logout());
      navigate("/login");
    }
  };
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);

    // Toggle sub-navigation for specific menus
    if (menu === "Analytics") {
      setShowAnalyticsSubNav(!showAnalyticsSubNav);
      setShowReportsSubNav(false); // Close other sub-menus
    } else if (menu === "Reports") {
      setShowReportsSubNav(!showReportsSubNav);
      setShowAnalyticsSubNav(false); // Close other sub-menus
    } else {
      setShowAnalyticsSubNav(false);
      setShowReportsSubNav(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Nhà Tuyển Dụng</h2>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            onClick={() => handleMenuClick("Overview")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Overview" ? "bg-gray-700" : ""
            }`}
          >
            Thông tin
          </a>
          <a
            href="#"
            onClick={() => handleMenuClick("Analytics")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Analytics" ? "bg-gray-700" : ""
            }`}
          >
            Quản lý tin tuyển dụng
          </a>
          {/* Sub-navigation for Analytics */}
          {showAnalyticsSubNav && (
            <div className="ml-4">
              <a
                href="#"
                onClick={() => setSelectedMenu("Traffic")}
                className={`block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                  selectedMenu === "Traffic" ? "bg-gray-700" : ""
                }`}
              >
                Tạo bài đăng
              </a>
              <a
                href="#"
                onClick={() => setSelectedMenu("Sales")}
                className={`block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                  selectedMenu === "Sales" ? "bg-gray-700" : ""
                }`}
              >
                Các bài đăng
              </a>
            </div>
          )}
          <a
            href="#"
            onClick={() => handleMenuClick("Reports")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Reports" ? "bg-gray-700" : ""
            }`}
          >
            Quản lý ứng viên
          </a>
          {/* Sub-navigation for Reports */}
          {showReportsSubNav && (
            <div className="ml-4">
              <a
                href="#"
                onClick={() => setSelectedMenu("Monthly Report")}
                className={`block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                  selectedMenu === "Monthly Report" ? "bg-gray-700" : ""
                }`}
              >
                Hồ sơ ứng tuyển
              </a>
              <a
                href="#"
                onClick={() => setSelectedMenu("Yearly Report")}
                className={`block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                  selectedMenu === "Yearly Report" ? "bg-gray-700" : ""
                }`}
              >
                ứng viên
              </a>
            </div>
          )}
          <a
            href="#"
            onClick={() => handleMenuClick("Settings")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Settings" ? "bg-gray-700" : ""
            }`}
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Nhà tuyển dụng</h1>
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Conditional content based on selected menu */}
          {selectedMenu === "Analytics" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Analytics Data</h2>
              {/* Content for Analytics */}
            </div>
          )}
          {selectedMenu === "Overview" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <EmployerManagement />
              {/* Content for Analytics */}
            </div>
          )}
          {selectedMenu === "Traffic" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <App />
            </div>
          )}
          {selectedMenu === "Sales" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Tiêu đề</th>
                    <th className="px-4 py-2">Mô tả</th>
                    <th className="px-4 py-2">Mức lương</th>
                    <th className="px-4 py-2">Ngày hết hạn</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Nhà tuyển dụng</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {jobPosts.map((post) => (
                    <tr key={post.MaTTD} className="border-b">
                      <td className="px-4 py-2">{post.tieude}</td>
                      <td className="px-4 py-2">{post.mota}</td>
                      <td className="px-4 py-2">{post.mucluong}</td>
                      <td className="px-4 py-2">
                        {new Date(post.Ngayhethan).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{post.trangthai}</td>
                      <td className="px-4 py-2">
                        {recruiters.find((rec) => rec.id === post.MaNTD)
                          ?.name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody> */}
              </table>
            </div>
          )}
          {selectedMenu === "Reports" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Reports Data</h2>
              {/* Content for Reports */}
            </div>
          )}
          {selectedMenu === "Monthly Report" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Hồ sơ ứng viên</h2>
              {/* Content for Monthly Report */}
            </div>
          )}
          {selectedMenu === "Yearly Report" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Yearly Report Data</h2>
              {/* Content for Yearly Report */}
            </div>
          )}
          {selectedMenu === "Settings" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              {/* Content for Settings */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
