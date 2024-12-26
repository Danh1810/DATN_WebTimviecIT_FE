import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";
import { toast } from "react-toastify";
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
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("year"); // "year" or "month"
  const [employers, setEmployers] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]); // List of payment history records
  const [employers1, setEmployers1] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd/admin");
      console.log("🚀 ~ fetchJobPosts ~ response:", response.data);
      setJobPosts(response.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách bài đăng");
    }
  };
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt");
      console.log("🚀 ~ fetchPaymentHistory ~ response:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };
  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };
  // Dữ liệu tăng trưởng theo tháng (2024)
  const monthlyGrowthData = [
    { week: "Tuần 1", newJobs: 120, newCandidates: 450 },
    { week: "Tuần 2", newJobs: 150, newCandidates: 480 },
    { week: "Tuần 3", newJobs: 140, newCandidates: 520 },
    { week: "Tuần 4", newJobs: 180, newCandidates: 550 },
  ];

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/nguoidung");
      console.log("🚀 ~ fetchUsers ~ response:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      console.log("🚀 ~ fetchEmployers ~ response:", response.data);
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };
  function countByField(companies, field = "linhvuc") {
    const countMap = {};

    companies.forEach((company) => {
      const key = company[field] || "Khác"; // Nếu không có trường thì gán "Khác"
      countMap[key] = (countMap[key] || 0) + 1;
    });

    // Chuyển đổi object thành mảng các đối tượng {linhvuc, count}
    return Object.keys(countMap).map((key) => ({
      [field]: key,
      count: countMap[key],
    }));
  }
  const count = countByField(employers, "linhvuc");
  console.log(count);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  function countByMaQuyenWithNameValue(data) {
    const roleMap = {
      1: "Admin",
      2: "Nhà tuyển dụng",
      3: "Người tìm việc",
    };

    const counts = {};

    // Đếm số lượng MaQuyen
    data.forEach((item) => {
      if (counts[item.MaQuyen]) {
        counts[item.MaQuyen]++;
      } else {
        counts[item.MaQuyen] = 1;
      }
    });

    // Chuyển đổi kết quả thành mảng name-value
    return Object.entries(counts).map(([key, value]) => ({
      name: roleMap[key] || `Unknown (${key})`, // Sử dụng roleMap để lấy tên
      value: value,
    }));
  }
  const result = countByMaQuyenWithNameValue(users);
  function countJobsByLocation(jobsData) {
    const locationCount = {};

    // Iterate over jobs and count by diaChiLamviec
    jobsData.forEach((job) => {
      const locations = job.diaChiLamviec.split(","); // Split multiple locations
      locations.forEach((location) => {
        location = location.trim(); // Trim whitespace
        if (locationCount[location]) {
          locationCount[location]++;
        } else {
          locationCount[location] = 1;
        }
      });
    });

    // Convert the result to an array of objects with name and jobs
    const result = Object.entries(locationCount).map(([name, jobs]) => ({
      name,
      jobs,
    }));

    return result;
  }
  const vldiachi = countJobsByLocation(jobPosts);

  function countJobsBySkill(jobsData) {
    const skillCount = {};

    // Iterate over jobs and count by skills
    jobsData.forEach((job) => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          const skillName = skill.ten;
          if (skillCount[skillName]) {
            skillCount[skillName]++;
          } else {
            skillCount[skillName] = 1;
          }
        });
      }
    });

    // Convert the result to an array of objects with name and jobs
    const result = Object.entries(skillCount).map(([name, jobs]) => ({
      name,
      jobs,
    }));

    return result;
  }
  const skilljob = countJobsBySkill(jobPosts);
  function countJobsByStatus(jobsData) {
    const statusCount = {};

    // Iterate over jobs and count by trangthai
    jobsData.forEach((job) => {
      const status = job.trangthai;
      if (statusCount[status]) {
        statusCount[status]++;
      } else {
        statusCount[status] = 1;
      }
    });

    // Convert the result to an array of objects with name and jobs
    const result = Object.entries(statusCount).map(([name, jobs]) => ({
      name,
      jobs,
    }));

    return result;
  }
  const trngthai = countJobsByStatus(jobPosts);

  function calculateTotalAmount(transactions) {
    return transactions.reduce((total, transaction) => {
      const amount = parseFloat(transaction.sotien) || 0; // Lấy giá trị số tiền hoặc 0 nếu không có
      return total + amount;
    }, 0); // Bắt đầu từ tổng là 0
  }
  const totalAmount = calculateTotalAmount(paymentHistory);
  useEffect(() => {
    fetchJobPosts();
    fetchJobSeekers();
    fetchUsers();
    fetchEmployers();
    fetchPaymentHistory();
  }, []);

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
            {/* <button
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
            </button> */}
          </div>
        </header>
        {/* {activeTab === "time-stats" && (
          <div className="grid grid-cols-1 gap-6 mt-6">
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
            {timeRange === "month" && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Chi Tiết Tháng Hiện Tại
                </h2>
                <div className="grid grid-cols-2 gap-6">
              
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
        )} */}
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
                  <span className="text-blue-600 font-bold ml-2">
                    {jobPosts.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">
                    Nhà tuyển dụng đang tuyển:
                  </span>
                  <span className="text-green-600 font-bold ml-2">
                    {employers.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ứng viên active:</span>
                  <span className="text-purple-600 font-bold ml-2">
                    {jobSeekers.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng số người dùng:</span>
                  <span className="text-orange-600 font-bold ml-2">
                    {users.length}
                  </span>
                </div>
                <div className="bg-orange-100 rounded-lg p-4 text-center shadow-sm">
                  <h3 className="text-xl font-bold text-blue-600">
                    {totalAmount}
                  </h3>
                  <p className="text-gray-600">Tổng doanh thu</p>
                </div>
              </div>
            </div>

            {/* Phân bố ngành nghề */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Phân Bố Users</h2>
              <PieChart width={350} height={250}>
                <Pie
                  data={result}
                  cx={175}
                  cy={125}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  style={{ fontSize: "12px" }} // Giảm kích thước font
                >
                  {result.map((entry, index) => (
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
                Các Khu Vực Tuyển Dụng
              </h2>
              <div className="space-y-4">
                {vldiachi.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{region.name}</h3>
                    </div>
                    <span className="text-green-600">
                      {region.jobs} việc làm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Thống kê mức lương */}
            {/* Thống kê trạng thái công việc */}
            <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Trạng Thái Công Việc
              </h2>
              <BarChart width={600} height={300} data={trngthai}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#8884d8" name="Số lượng công việc" />
              </BarChart>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Các Lĩnh Vực Tuyển Dụng
              </h2>
              <div className="space-y-4">
                {count.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{region.linhvuc}</h3>
                    </div>
                    <span className="text-green-600">
                      {region.count} việc làm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top công nghệ */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Các Skills Yêu Cầu</h2>
              <div className="space-y-3">
                {skilljob.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{tech.name}</span>
                    <div className="text-right">
                      <div className="text-blue-600">{tech.jobs} việc làm</div>
                      {/* <div className="text-sm text-gray-500">
                        {tech.candidates} ứng viên
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === "trends" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
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
        )} */}
      </div>
    </div>
  );
};

export default PlatformDashboard;
