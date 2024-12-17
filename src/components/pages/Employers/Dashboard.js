import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Dữ liệu mẫu
  const jobApplicationData = [
    { name: "Frontend", applied: 250, interviewed: 80, hired: 25 },
    { name: "Backend", applied: 180, interviewed: 60, hired: 20 },
    { name: "Fullstack", applied: 150, interviewed: 45, hired: 15 },
    { name: "Mobile", applied: 100, interviewed: 30, hired: 10 },
  ];

  const candidateSourceData = [
    { name: "Nền tảng tuyển dụng", value: 40 },
    { name: "Giới thiệu", value: 25 },
    { name: "Mạng xã hội", value: 20 },
    { name: "Trang web công ty", value: 15 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bảng Điều Khiển Nhà Tuyển Dụng
          </h1>
          <div className="mt-4 flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng Quan
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "candidates"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("candidates")}
            >
              Ứng Viên
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("jobs")}
            >
              Việc Làm
            </button>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thống kê tổng quan */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Tổng Quan Tuyển Dụng
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Tổng Số Ứng Viên:</span>
                  <span className="text-blue-600 font-bold ml-2">680</span>
                </div>
                <div>
                  <span className="text-gray-600">Đã Phỏng Vấn:</span>
                  <span className="text-green-600 font-bold ml-2">215</span>
                </div>
                <div>
                  <span className="text-gray-600">Đã Tuyển:</span>
                  <span className="text-purple-600 font-bold ml-2">70</span>
                </div>
              </div>
            </div>

            {/* Biểu đồ nguồn ứng viên */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Nguồn Ứng Viên</h2>
              <PieChart width={350} height={250}>
                <Pie
                  data={candidateSourceData}
                  cx={175}
                  cy={125}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {candidateSourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Thống kê việc làm */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Việc Làm Đang Tuyển
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng Số Việc:</span>
                  <span className="text-blue-600 font-bold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Việc Mới:</span>
                  <span className="text-green-600 font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đang Tuyển:</span>
                  <span className="text-yellow-600 font-bold">8</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "candidates" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Phân Tích Ứng Viên</h2>
            <BarChart width={800} height={300} data={jobApplicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applied" fill="#8884d8" name="Đã Ứng Tuyển" />
              <Bar dataKey="interviewed" fill="#82ca9d" name="Đã Phỏng Vấn" />
              <Bar dataKey="hired" fill="#ffc658" name="Đã Tuyển" />
            </BarChart>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Danh Sách Việc Làm</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Vị Trí</th>
                  <th className="p-3 text-center">Ứng Viên</th>
                  <th className="p-3 text-center">Trạng Thái</th>
                  <th className="p-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Frontend Developer</td>
                  <td className="p-3 text-center">25/100</td>
                  <td className="p-3 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Đang Tuyển
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Chi Tiết
                    </button>
                  </td>
                </tr>
                {/* Thêm các dòng khác tương tự */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
