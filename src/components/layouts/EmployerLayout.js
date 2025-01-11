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
  const [expandedMenu, setExpandedMenu] = useState("");

  // Menu Items
  const menuItems = [
    { label: "Thống kê", key: "tk", path: "/ntd/db" },
    { label: "Thông tin", key: "Overview", path: "/ntd/thongtin" },
    {
      label: "Quản lý tin tuyển dụng",
      key: "qlntd",
      children: [
        {
          label: "Tạo tin tuyển dụng",
          key: "Createttd",
          path: "/ntd/qlttd/tao-bai-dang",
        },
        {
          label: "Các tin tuyển dụng",
          key: "ttd",
          path: "/ntd/qlttd/cac-bai-dang",
        },
        {
          label: "Mua thêm lượt đăng tin",
          key: "mua",
          path: "/ntd/muabaidang",
        },
      ],
    },
    { label: "Tìm kiếm ứng viên", key: "tkuv", path: "/ntd/tkuv" },
    { label: "Hồ sơ đã lưu", key: "lhs", path: "/ntd/luuhs" },
    { label: "Lịch sử thanh toán", key: "lstt", path: "/ntd/lstt" },
  ];

  const name = localStorage.getItem("username") || "Nhà Tuyển Dụng";

  useEffect(() => {
    const activeMenu = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    setSelectedMenu(activeMenu ? activeMenu.key : "Overview");

    // Automatically expand the menu containing the current path
    const parentMenu = menuItems.find((item) =>
      item.children?.some((child) => location.pathname.startsWith(child.path))
    );
    setExpandedMenu(parentMenu ? parentMenu.key : "");
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

  const handleMenuClick = (menu) => {
    if (menu.children) {
      setExpandedMenu((prev) => (prev === menu.key ? "" : menu.key));
    } else {
      setSelectedMenu(menu.key);
      navigate(menu.path);
    }
  };

  const handleChildClick = (child) => {
    setSelectedMenu(child.key);
    navigate(child.path);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <div key={item.key}>
              <a
                onClick={() => handleMenuClick(item)}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                  selectedMenu === item.key || expandedMenu === item.key
                    ? "bg-gray-700"
                    : ""
                }`}
              >
                {item.label}
              </a>
              {/* Sub-navigation */}
              {item.children && expandedMenu === item.key && (
                <div className="ml-4">
                  {item.children.map((child) => (
                    <a
                      key={child.key}
                      onClick={() => handleChildClick(child)}
                      className={`block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                        selectedMenu === child.key ? "bg-gray-700" : ""
                      }`}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
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
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
