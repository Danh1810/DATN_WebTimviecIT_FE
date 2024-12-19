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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const PlatformDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("year"); // "year" or "month"

  // Dữ liệu theo năm (2024)
  const yearlyData = [
    { month: "T1", jobs: 4800, applications: 15000, matches: 720 },
    { month: "T2", jobs: 5100, applications: 16200, matches: 780 },
    { month: "T3", jobs: 5280, applications: 17500, matches: 850 },
    { month: "T4", jobs: 5500, applications: 18200, matches: 890 },
    // ... các tháng tiếp theo
  ];

  // Dữ liệu lương theo năm
  const yearlySalaryTrends = [
    { year: "2020", frontend: 18, backend: 20, devops: 25, mobile: 19 },
    { year: "2021", frontend: 22, backend: 24, devops: 28, mobile: 23 },
    { year: "2022", frontend: 25, backend: 28, devops: 32, mobile: 26 },
    { year: "2023", frontend: 28, backend: 32, devops: 38, mobile: 29 },
    { year: "2024", frontend: 32, backend: 35, devops: 42, mobile: 33 },
  ];

  // Dữ liệu tăng trưởng theo tháng (2024)
  const monthlyGrowthData = [
    { week: "Tuần 1", newJobs: 120, newCandidates: 450 },
    { week: "Tuần 2", newJobs: 150, newCandidates: 480 },
    { week: "Tuần 3", newJobs: 140, newCandidates: 520 },
    { week: "Tuần 4", newJobs: 180, newCandidates: 550 },
  ];

  // ... (previous components remain the same)

  // Thêm tab mới cho thống kê theo thời gian
  const jobCategoryData = [
    { name: "Web Developer", value: 35 },
    { name: "Mobile Developer", value: 20 },
    { name: "DevOps/SysAdmin", value: 15 },
    { name: "Data Engineer", value: 12 },
    { name: "QA/Tester", value: 10 },
    { name: "Others", value: 8 },
  ];

  // Dữ liệu mức lương theo kinh nghiệm
  const salaryData = [
    { exp: "Fresher", junior: 8, middle: 0, senior: 0 },
    { exp: "1-2 năm", junior: 12, middle: 18, senior: 0 },
    { exp: "3-5 năm", junior: 0, middle: 25, senior: 35 },
    { exp: "5+ năm", junior: 0, middle: 30, senior: 50 },
  ];

  // Dữ liệu ngôn ngữ/công nghệ hot
  const techTrendData = [
    { name: "JavaScript", jobs: 1200, candidates: 800 },
    { name: "Java", jobs: 950, candidates: 600 },
    { name: "Python", jobs: 850, candidates: 700 },
    { name: "React", jobs: 800, candidates: 500 },
    { name: "Node.js", jobs: 600, candidates: 400 },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Thống Kê Thị Trường IT
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
                activeTab === "trends"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("trends")}
            >
              Xu Hướng
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "time-stats"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("time-stats")}
            >
              Thống Kê Thời Gian
            </button>
          </div>
        </header>
        {activeTab === "time-stats" && (
          <div className="grid grid-cols-1 gap-6 mt-6">
            {/* Điều khiển thời gian */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded ${
                    timeRange === "year"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTimeRange("year")}
                >
                  Theo Năm
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    timeRange === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTimeRange("month")}
                >
                  Theo Tháng
                </button>
              </div>
            </div>

            {/* Biểu đồ tăng trưởng */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Tăng Trưởng Việc Làm & Ứng Viên
              </h2>
              <AreaChart width={800} height={300} data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Việc làm"
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Ứng tuyển"
                />
              </AreaChart>
            </div>

            {/* Xu hướng lương */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Xu Hướng Lương Theo Năm (Triệu VNĐ)
              </h2>
              <LineChart width={800} height={300} data={yearlySalaryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="frontend"
                  stroke="#8884d8"
                  name="Frontend"
                />
                <Line
                  type="monotone"
                  dataKey="backend"
                  stroke="#82ca9d"
                  name="Backend"
                />
                <Line
                  type="monotone"
                  dataKey="devops"
                  stroke="#ffc658"
                  name="DevOps"
                />
                <Line
                  type="monotone"
                  dataKey="mobile"
                  stroke="#ff7300"
                  name="Mobile"
                />
              </LineChart>
            </div>

            {/* Thống kê chi tiết tháng hiện tại */}
            {timeRange === "month" && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Chi Tiết Tháng Hiện Tại
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Tăng trưởng theo tuần */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Tăng Trưởng Theo Tuần
                    </h3>
                    <BarChart width={400} height={300} data={monthlyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="newJobs"
                        fill="#8884d8"
                        name="Việc làm mới"
                      />
                      <Bar
                        dataKey="newCandidates"
                        fill="#82ca9d"
                        name="Ứng viên mới"
                      />
                    </BarChart>
                  </div>

                  {/* Thống kê tháng */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tổng Kết Tháng</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Tổng Việc Mới</p>
                        <p className="text-2xl font-bold text-blue-600">590</p>
                        <p className="text-xs text-green-600">
                          +12% so với tháng trước
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Ứng Viên Mới</p>
                        <p className="text-2xl font-bold text-green-600">
                          2,000
                        </p>
                        <p className="text-xs text-green-600">
                          +15% so với tháng trước
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Tỷ Lệ Chuyển Đổi
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          8.5%
                        </p>
                        <p className="text-xs text-green-600">
                          +0.5% so với tháng trước
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Lương TB Offer</p>
                        <p className="text-2xl font-bold text-orange-600">
                          28.5M
                        </p>
                        <p className="text-xs text-green-600">
                          +1.2M so với tháng trước
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tổng quan thị trường */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Tổng Quan Thị Trường
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Tổng số việc làm:</span>
                  <span className="text-blue-600 font-bold ml-2">5,280</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    Nhà tuyển dụng đang tuyển:
                  </span>
                  <span className="text-green-600 font-bold ml-2">1,850</span>
                </div>
                <div>
                  <span className="text-gray-600">Ứng viên active:</span>
                  <span className="text-purple-600 font-bold ml-2">12,500</span>
                </div>
                <div>
                  <span className="text-gray-600">Matching thành công:</span>
                  <span className="text-orange-600 font-bold ml-2">850</span>
                </div>
              </div>
            </div>

            {/* Phân bố ngành nghề */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Phân Bố Ngành Nghề</h2>
              <PieChart width={350} height={250}>
                <Pie
                  data={jobCategoryData}
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

            {/* Thống kê khu vực */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Top Khu Vực Tuyển Dụng
              </h2>
              <div className="space-y-4">
                {[
                  { name: "Hồ Chí Minh", jobs: 2500, growth: "+15%" },
                  { name: "Hà Nội", jobs: 1800, growth: "+12%" },
                  { name: "Đà Nẵng", jobs: 580, growth: "+8%" },
                  { name: "Khác", jobs: 400, growth: "+5%" },
                ].map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{region.name}</h3>
                      <p className="text-sm text-gray-500">
                        {region.jobs} việc làm
                      </p>
                    </div>
                    <span className="text-green-600">{region.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Thống kê mức lương */}
            <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Mức Lương Theo Kinh Nghiệm
              </h2>
              <BarChart width={600} height={300} data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exp" />
                <YAxis unit="M" />
                <Tooltip />
                <Legend />
                <Bar dataKey="junior" fill="#8884d8" name="Junior" />
                <Bar dataKey="middle" fill="#82ca9d" name="Middle" />
                <Bar dataKey="senior" fill="#ffc658" name="Senior" />
              </BarChart>
            </div>

            {/* Top công nghệ */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Skills Yêu Cầu</h2>
              <div className="space-y-3">
                {techTrendData.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{tech.name}</span>
                    <div className="text-right">
                      <div className="text-blue-600">{tech.jobs} việc làm</div>
                      <div className="text-sm text-gray-500">
                        {tech.candidates} ứng viên
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Xu hướng tuyển dụng */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Xu Hướng Công Nghệ Hot
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Top Framework/Library
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "React", percent: 85 },
                      { name: "Vue.js", percent: 65 },
                      { name: "Angular", percent: 55 },
                      { name: "Next.js", percent: 45 },
                    ].map((tech, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-24">{tech.name}</div>
                        <div className="flex-1 h-4 bg-gray-200 rounded">
                          <div
                            className="h-4 bg-blue-600 rounded"
                            style={{ width: `${tech.percent}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-right">{tech.percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mức lương thị trường */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Mức Lương Trung Bình Theo Vị Trí
              </h2>
              <div className="space-y-4">
                {[
                  {
                    position: "Frontend Developer",
                    range: "15-35M",
                    demand: "Cao",
                  },
                  {
                    position: "Backend Developer",
                    range: "18-40M",
                    demand: "Rất cao",
                  },
                  {
                    position: "DevOps Engineer",
                    range: "25-50M",
                    demand: "Cao",
                  },
                  {
                    position: "Mobile Developer",
                    range: "15-35M",
                    demand: "Trung bình",
                  },
                  { position: "Data Engineer", range: "20-45M", demand: "Cao" },
                ].map((job, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{job.position}</h3>
                        <p className="text-sm text-gray-500">
                          Mức lương: {job.range}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          job.demand === "Rất cao"
                            ? "bg-red-100 text-red-800"
                            : job.demand === "Cao"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.demand}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformDashboard;
