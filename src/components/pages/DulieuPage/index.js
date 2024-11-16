import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../../services/auth/logout";
import { logout } from "../../slice/authSlice";
import JobLevelManagement from "../DulieuPage/Capbac";
import JobPostSkills from "./KNtt";
import PaymentHistory from "./Lstt";
import UserManagement from "./Nguoidung";
import EmployerManagement from "./NTD";
import JobSeekerManagement from "./NTV";
import InterviewChat from "./Phongvan";
import RoleManagement from "./Quyen";
import PaymentTypeManagement from "./Thanhtoan";
import App from "./TinTD";
import JobApplicationForm from "./Ungtuyen";
import UserList from "./VTTT";
import SkillsManager from "./KyNang";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const res = await Logout();
    if (+res.code === 0) {
      localStorage.clear();
      localStorage.setItem("isAuth", false);
      localStorage.setItem("prePath", location.pathname);
      dispatch(logout());
      navigate("/login");
    }
  };

  const [selectedMenu, setSelectedMenu] = useState("Overview");

  const renderContent = () => {
    switch (selectedMenu) {
      case "capbac":
        return <JobLevelManagement />;
      case "Kynang":
        return <SkillsManager />;
      case "ntd":
        return <EmployerManagement />;
      case "ntv":
        return <JobSeekerManagement />;
      case "nd":
        return <UserManagement />;
      case "quyen":
        return <RoleManagement />;
      case "thanhtoan":
        return <PaymentTypeManagement />;
      case "lstt":
        return <PaymentHistory />;
      case "ung":
        return <JobApplicationForm />;
      case "Phongvan":
        return <InterviewChat />;
      case "vttt":
        return <UserList />;
      case "ttd":
        return <App />;
      case "kntt":
        return <JobPostSkills />;
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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Dữ liệu</h2>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            onClick={() => setSelectedMenu("capbac")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "capbac" ? "bg-gray-700" : ""
            }`}
          >
            Cấp bậc
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("Kynang")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Kynang" ? "bg-gray-700" : ""
            }`}
          >
            Kỹ Năng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("ntd")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "ntd" ? "bg-gray-700" : ""
            }`}
          >
            Nhà tuyển dụng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("ntv")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "ntv" ? "bg-gray-700" : ""
            }`}
          >
            Người tìm việc
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("nd")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "nd" ? "bg-gray-700" : ""
            }`}
          >
            Người Dùng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("quyen")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "quyen" ? "bg-gray-700" : ""
            }`}
          >
            Quyền
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("thanhtoan")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "thanhtoan" ? "bg-gray-700" : ""
            }`}
          >
            Thanh toán
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("lstt")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "lstt" ? "bg-gray-700" : ""
            }`}
          >
            Lịch sử thanh toán
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("ung")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "ung" ? "bg-gray-700" : ""
            }`}
          >
            Ứng tuyển
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("Phongvan")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "Phongvan" ? "bg-gray-700" : ""
            }`}
          >
            Phỏng vấn
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("ttd")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "ttd" ? "bg-gray-700" : ""
            }`}
          >
            Tin tuyển dụng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("vttt")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "vttt" ? "bg-gray-700" : ""
            }`}
          >
            Vị trí tuyển dụng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("kntt")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "kntt" ? "bg-gray-700" : ""
            }`}
          >
            Kỹ năng tuyển dụng
          </a>
          <a
            href="#"
            onClick={() => setSelectedMenu("lcv")}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              selectedMenu === "lcv" ? "bg-gray-700" : ""
            }`}
          >
            Lưu công việc
          </a>
        </nav>

        {/* Add other menu items as needed */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Nhập xuất dữ liệu</h1>
        </header>

        {/* Content */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
