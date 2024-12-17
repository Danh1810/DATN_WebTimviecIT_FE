import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const JobStatsDashboard = () => {
  // Dữ liệu mẫu về việc làm IT
  const jobTrendsData = [
    { name: "T1", jobs: 500, applicants: 2000 },
    { name: "T2", jobs: 650, applicants: 2500 },
    { name: "T3", jobs: 800, applicants: 3200 },
    { name: "T4", jobs: 900, applicants: 3800 },
    { name: "T5", jobs: 1100, applicants: 4500 },
    { name: "T6", jobs: 1300, applicants: 5200 },
  ];

  const jobCategoryData = [
    { name: "Lập trình viên", value: 40 },
    { name: "Quản trị hệ thống", value: 25 },
    { name: "An ninh mạng", value: 15 },
    { name: "Phân tích dữ liệu", value: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thống Kê Việc Làm CNTT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biểu đồ xu hướng việc làm */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Xu Hướng Việc Làm</h2>
          <LineChart width={500} height={300} data={jobTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="jobs"
              stroke="#8884d8"
              name="Số việc làm"
            />
            <Line
              type="monotone"
              dataKey="applicants"
              stroke="#82ca9d"
              name="Số ứng viên"
            />
          </LineChart>
        </div>

        {/* Biểu đồ ngành nghề */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Phân Bổ Ngành Nghề</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={jobCategoryData}
              cx={250}
              cy={150}
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {jobCategoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center shadow-sm">
          <h3 className="text-xl font-bold text-blue-600">1,300+</h3>
          <p className="text-gray-600">Việc làm tháng này</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center shadow-sm">
          <h3 className="text-xl font-bold text-green-600">5,200</h3>
          <p className="text-gray-600">Ứng viên đăng ký</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center shadow-sm">
          <h3 className="text-xl font-bold text-yellow-600">85%</h3>
          <p className="text-gray-600">Tỷ lệ tuyển dụng</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center shadow-sm">
          <h3 className="text-xl font-bold text-red-600">3</h3>
          <p className="text-gray-600">Top ngành hot</p>
        </div>
      </div>
    </div>
  );
};

export default JobStatsDashboard;
