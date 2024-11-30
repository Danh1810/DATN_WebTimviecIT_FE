import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../../services/auth/logout";
import { logout } from "../../slice/authSlice";
import App from "./QLTintd";
import UserManagement from "./QLND";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("username");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [selectedMenu, setSelectedMenu] = useState("Overview");

  const handleLogout = async () => {
    const res = await Logout();
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

  const menuItems = [
    { label: "Overview", key: "Overview" },
    { label: "Quản lý tin tuyển dụng", key: "Analytics" },
    { label: "Quản lý người dùng", key: "Reports" },
    { label: "Settings", key: "Settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={() => setSelectedMenu(item.key)}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                selectedMenu === item.key ? "bg-gray-700" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">{name}</h1>
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
          {selectedMenu === "Overview" && (
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
          )}

          {selectedMenu === "Analytics" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <App />
            </div>
          )}

          {selectedMenu === "Reports" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <UserManagement />
            </div>
          )}

          {selectedMenu === "Settings" && (
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p>Hiển thị cài đặt tại đây...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
