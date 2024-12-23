import React from "react";
import { useState } from "react";
import { ChevronDownIcon, BellIcon } from "@heroicons/react/20/solid";
import { Logout } from "../services/auth/logout";
import { logout } from "../slice/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Layout({ children }) {
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isOpportunityOpen, setIsOpportunityOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const user = { name: "Nguyễn Văn A" };
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
  return (
    <div>
      <nav className="bg-gray-700 text-white flex items-center justify-between p-4">
        {/* Left Side: Logo */}
        <div
          onClick={() => (window.location.href = "/home")}
          className="flex items-center space-x-4"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfsesMJwwXL8130hzXhA8LtGBG1HMN6lKLA&s"
            alt="Company Logo"
            className="h-8"
          />
          <span className="text-xl font-bold">Việc làm IT</span>
        </div>

        {/* Center: Menu Items */}
        <div className="hidden md:flex space-x-8">
          {/* Menu Dropdown 1 */}
          <div className="relative">
            <button
              onClick={() => setIsOpportunityOpen(!isOpportunityOpen)}
              className="flex items-center space-x-1 hover:text-gray-200"
            >
              <span className="font-extrabold">Việc Làm</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isOpportunityOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg z-20 w-48">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Theo kỹ năng
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Theo cấp bậc
                </a>
              </div>
            )}
          </div>

          {/* Menu Dropdown 2 */}
          <div className="relative">
            <button
              onClick={() => setIsToolOpen(!isToolOpen)}
              className="flex items-center space-x-1 hover:text-gray-200"
            >
              <span className="font-extrabold">Công ty</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isToolOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg z-20 w-48">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Tool 1
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Tool 2
                </a>
              </div>
            )}
          </div>

          {/* New Employer Registration Link */}
          <a
            href="/se"
            className="text-white hover:text-gray-200 font-extrabold flex items-center"
          >
            Đăng Ký Nhà Tuyển Dụng
          </a>
        </div>

        {/* Right Side: User & Language Options */}
        <div className="flex items-center space-x-6 pr-4">
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRegionOpen(!isRegionOpen)}
              className="flex items-center space-x-1 hover:text-gray-200 font-extrabold"
            >
              {auth.isAuth ? (
                <>
                  <span>{auth.username}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Đăng nhập / Đăng ký</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </>
              )}
            </button>
            {isRegionOpen && (
              <div className="absolute right-0 bg-white text-black mt-2 p-2 rounded shadow-lg z-20 w-48">
                {auth.isAuth ? (
                  <>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Thông tin cá nhân
                    </a>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </a>
                    <a
                      href="/singup"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Đăng ký
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow"> {children}</main>
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto w-full max-w-screen-xl p-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="/" className="flex items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfsesMJwwXL8130hzXhA8LtGBG1HMN6lKLA&s"
                  className="h-10 me-3"
                  alt="ViecLamIT Logo"
                />
                <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                  ViecLamIT
                </span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                  Dành cho ứng viên
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="/jobs" className="hover:underline">
                      Tìm việc làm
                    </a>
                  </li>
                  <li>
                    <a href="/signup" className="hover:underline">
                      Đăng ký tài khoản
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                  Dành cho nhà tuyển dụng
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="/employers" className="hover:underline">
                      Đăng tin tuyển dụng
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="hover:underline">
                      Bảng giá dịch vụ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                  Về chúng tôi
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="/about" className="hover:underline">
                      Giới thiệu
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:underline">
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-700 sm:mx-auto" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-400 sm:text-center">
              © 2023 ViecLamIT. Mọi quyền được bảo lưu.
            </span>
            <div className="flex mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white me-5">
                <i className="fab fa-facebook"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white me-5">
                <i className="fab fa-twitter"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
