import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../services/auth/logout";
import { logout } from "../slice/authSlice";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const name = localStorage.getItem("username") || "Admin";
  const [selectedMenu, setSelectedMenu] = useState("");

  // Update the selected menu based on the current path
  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    setSelectedMenu(activeMenuItem ? activeMenuItem.key : "Overview");
  }, [location.pathname]);
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

  const menuItems = [
    { label: "Overview", key: "Overview", path: "/dashboard/overview" },
    {
      label: "Quản lý tin tuyển dụng",
      key: "Tintuyendung",
      path: "/dashboard/admin/tintuyendung",
    },
    {
      label: "Quản lý người dùng",
      key: "Nguoidung",
      path: "/dashboard/admin/nguoidung",
    },
    {
      label: "Quản lý Nhà tuyển dụng",
      key: "ntd",
      path: "/dashboard/admin/ntd",
    },
  ];

  const handleMenuClick = (item) => {
    setSelectedMenu(item.key);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleMenuClick(item)}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                selectedMenu === item.key ? "bg-gray-700" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
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
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
