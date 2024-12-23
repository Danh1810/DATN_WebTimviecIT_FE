import React, { useState, useEffect } from "react";
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
import axios from "../../services/axios";
const EmployerDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const id = localStorage.getItem("id");
  const [activeTab, setActiveTab] = useState("overview");
  const [jobPosts, setJobPosts] = useState([]);
  const [jobPostsmonth, setJobPostsmonth] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd/ntd", { params: { id: id } });
      console.log("🚀 ~ fetchJobPosts ~ response:", response.data);
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt/ntd", { params: { id: id } });
      console.log("🚀 ~ fetchPaymentHistory ~ response:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };
  const fetchJobPostsmonth = async () => {
    try {
      const response = await axios.get("/Ut/thongke", { params: { id: id } });
      console.log("🚀 ~ fetchJobPosts ~ response:", response.data);
      setJobPostsmonth(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd/tk", { params: { id: id } });
      setRecruiters(response.data);
      console.log("🚀 ~ fetchRecruiters ~ response.data:", response.data.id);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  const processJobPostsByMonth = (data) => {
    const jobPostsByMonth = {};

    data.forEach((jobPost) => {
      // Chuyển đổi ngày tạo thành định dạng YYYY-MM
      const date = new Date(jobPost.Ngaytao);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      // Khởi tạo object cho tháng nếu chưa có
      if (!jobPostsByMonth[month]) {
        jobPostsByMonth[month] = {
          month, // tháng dạng YYYY-MM
          totalJobPosts: 0, // tổng số tin tuyển dụng
          jobPosts: [], // lưu trữ chi tiết tin tuyển dụng (nếu cần)
        };
      }

      // Tăng số lượng tin tuyển dụng
      jobPostsByMonth[month].totalJobPosts += 1;
      // Lưu thông tin tin tuyển dụng (tùy chọn)
      jobPostsByMonth[month].jobPosts.push(jobPost);
    });

    // Chuyển đổi object thành array và sắp xếp theo tháng
    return Object.values(jobPostsByMonth).sort((a, b) =>
      b.month.localeCompare(a.month)
    );
  };

  const processCurrentMonthJobPosts = (data) => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;

    const jobPostsThisMonth = data.filter((jobPost) => {
      const postDate = new Date(jobPost.Ngaytao);
      const postMonth = `${postDate.getFullYear()}-${(postDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      return postMonth === currentMonth;
    });

    return {
      month: currentMonth,
      totalJobPosts: jobPostsThisMonth.length,
      jobPosts: jobPostsThisMonth,
    };
  };
  const vltn = processCurrentMonthJobPosts(jobPosts);
  // Dữ liệu thống kê theo vị trí
  const jobApplicationData = [
    { name: "Frontend Developer", applied: 150, interviewed: 45, hired: 12 },
    { name: "Backend Developer", applied: 120, interviewed: 35, hired: 8 },
    { name: "DevOps Engineer", applied: 80, interviewed: 25, hired: 6 },
    { name: "QA Engineer", applied: 90, interviewed: 30, hired: 7 },
    { name: "UI/UX Designer", applied: 70, interviewed: 20, hired: 5 },
  ];

  // Dữ liệu nguồn ứng viên IT
  const candidateSourceData = [
    { name: "LinkedIn", value: 35 },
    { name: "GitHub", value: 25 },
    { name: "Stack Overflow", value: 20 },
    { name: "IT Communities", value: 15 },
    { name: "Referrals", value: 5 },
  ];

  // Thống kê kỹ năng được yêu cầu nhiều

  //chi phi theo thang
  function calculateTotals(data) {
    const totalResult = {
      totalAmount: 0,
      monthlyTotals: [],
    };

    const monthlyMap = {}; // Để tạm thời lưu dữ liệu theo tháng/năm

    data.forEach((entry) => {
      const amount = parseFloat(entry.sotien); // Chuyển đổi "sotien" thành số
      const date = new Date(entry.Ngaythanhtoan); // Chuyển đổi "Ngaythanhtoan" thành đối tượng Date
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`; // Định dạng tháng/năm

      // Cộng vào tổng số tiền
      totalResult.totalAmount += amount;

      // Cộng vào tổng số tiền theo tháng
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = 0;
      }
      monthlyMap[monthYear] += amount;
    });

    // Chuyển đổi dữ liệu từ monthlyMap sang mảng monthlyTotals
    for (const [month, chiphi] of Object.entries(monthlyMap)) {
      totalResult.monthlyTotals.push({ month, chiphi });
    }

    return totalResult;
  }
  const result = calculateTotals(paymentHistory);
  const totalApplications = recruiters.reduce((total, emp) => {
    return (
      total +
      emp.jobPosts.reduce((jobTotal, job) => {
        return jobTotal + job.jbp.length;
      }, 0)
    );
  }, 0);
  const getAllJobPosts = (recruiters) => {
    const allJobs = [];
    recruiters.forEach((recruiter) => {
      recruiter.jobPosts.forEach((job) => {
        allJobs.push({
          ...job, // Sao chép toàn bộ thông tin của job post
          applications: job.jbp.length, // Thêm trường số lượng hồ sơ nộp
        });
      });
    });
    return allJobs;
  };
  const ti = getAllJobPosts(recruiters);
  const countSkillsInJobPosts = (jobPosts) => {
    const skillCounts = {};

    // Duyệt qua tất cả bài đăng tuyển dụng
    jobPosts.forEach((jobPost) => {
      if (jobPost.skills) {
        jobPost.skills.forEach((skillObj) => {
          const skillName = skillObj.ten;

          // Tăng giá trị đếm cho kỹ năng đó
          if (skillCounts[skillName]) {
            skillCounts[skillName]++;
          } else {
            skillCounts[skillName] = 1;
          }
        });
      }
    });

    // Chuyển đổi kết quả thành mảng dạng { name, count }
    return Object.entries(skillCounts).map(([name, count]) => ({
      name,
      count,
    }));
  };

  // Dữ liệu mẫu (một danh sách các bài đăng tuyển dụng)

  // Gọi hàm và in kết quả
  const topSkillsData = countSkillsInJobPosts(ti);
  console.log("🚀 ~ EmployerDashboard ~ ti:", ti);
  function calculateCurrentMonthTotal(data) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Tháng hiện tại (0-11)
    const currentYear = currentDate.getFullYear(); // Năm hiện tại

    let totalCurrentMonth = 0;

    data.forEach((entry) => {
      const paymentDate = new Date(entry.Ngaythanhtoan);
      const paymentMonth = paymentDate.getMonth(); // Tháng của khoản thanh toán
      const paymentYear = paymentDate.getFullYear(); // Năm của khoản thanh toán

      // Kiểm tra xem khoản thanh toán có thuộc tháng hiện tại không
      if (paymentMonth === currentMonth && paymentYear === currentYear) {
        totalCurrentMonth += parseFloat(entry.sotien);
      }
    });

    return totalCurrentMonth;
  }
  const currentMonthTotal = calculateCurrentMonthTotal(paymentHistory);
  const currentDate1 = new Date();
  const currentMonth1 = `${currentDate1.getFullYear()}-${(
    currentDate1.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  console.log("🚀 ~ currentMonth1 ~ currentMonth1:", currentMonth1);
  console.log("🚀 ~ EmployerDashboard ~ utmonth:", jobPostsmonth);
  console.log("Total Applications:", totalApplications);
  console.log("Tổng số tiền theo tháng:", result.monthlyTotals);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const calculateMatchPercentage = (jobPost, applicant) => {
    // 1. Tính tỷ lệ kỹ năng khớp
    const requiredSkills = jobPost.skills.map((skill) => skill.ten);
    const applicantSkills = applicant.kyNangLapTrinh;

    const matchedSkills = applicantSkills.filter((skill) =>
      requiredSkills.includes(skill)
    );
    const skillMatchPercentage =
      (matchedSkills.length / requiredSkills.length) * 100;

    // 2. Tính chênh lệch kinh nghiệm
    const requiredExperience = parseFloat(jobPost.kinhNghiem.split("-")[0]); // Lấy số năm kinh nghiệm yêu cầu
    const applicantExperience = parseFloat(
      applicant.kinhNghiemLamViec.split(" ")[0]
    ); // Lấy số năm thực tế

    let experienceMatchPercentage = 0;

    if (applicantExperience >= requiredExperience) {
      // Nếu kinh nghiệm thực tế >= yêu cầu
      experienceMatchPercentage = 10; // Cộng thêm tối đa 10% nếu ứng viên có kinh nghiệm tốt hơn.
    } else {
      // Nếu kinh nghiệm thực tế < yêu cầu
      experienceMatchPercentage =
        (applicantExperience / requiredExperience) * 100;
    }

    // 3. Tổng hợp tỷ lệ
    const totalMatchPercentage = Math.min(
      skillMatchPercentage + experienceMatchPercentage,
      100
    ); // Tổng hợp, không vượt quá 100%.

    return {
      skillMatchPercentage: skillMatchPercentage.toFixed(2) + "%",
      experienceMatchPercentage: experienceMatchPercentage.toFixed(2) + "%",
      totalMatchPercentage: totalMatchPercentage.toFixed(2) + "%",
    };
  };

  // Gọi hàm và in kết quả
  // const matchResult = calculateMatchPercentage(jobPost, applicant);
  // console.log(matchResult);

  useEffect(() => {
    fetchJobPosts();
    fetchRecruiters();
    fetchJobPostsmonth();
    fetchPaymentHistory();
    // fetchLevels();
  }, [id]);
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Thống Kê Tuyển Dụng IT
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
                activeTab === "skills"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("skills")}
            >
              Kỹ Năng
            </button>
            {/* <button
              className={`px-4 py-2 rounded ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Phân Tích
            </button> */}
          </div>
        </header>

        {activeTab === "overview" && (
          <div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Hiệu Suất Tuyển Dụng
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600">Tổng Số CV IT:</span>
                    <span className="text-blue-600 font-bold ml-2"></span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tỷ lệ phản hồi:</span>
                    <span className="text-green-600 font-bold ml-2">85%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      Thời gian tuyển trung bình:
                    </span>
                    <span className="text-purple-600 font-bold ml-2">
                      25 ngày
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">CV đạt yêu cầu:</span>
                    <span className="text-orange-600 font-bold ml-2">65%</span>
                  </div>
                </div>
              </div>

             
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Nguồn Ứng Viên IT
                </h2>
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

            
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Trạng Thái Tuyển Dụng
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vị trí đang tuyển:</span>
                    <span className="text-blue-600 font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vị trí cấp cao:</span>
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vị trí fresher:</span>
                    <span className="text-yellow-600 font-bold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã tuyển trong tháng:</span>
                    <span className="text-purple-600 font-bold">8</span>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-blue-600">
                  {jobPosts.length}
                </h3>
                <p className="text-gray-600">Việc làm đã đăng </p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-green-600">
                  {totalApplications}
                </h3>
                <p className="text-gray-600">Ứng viên đã nộp hồ sơ </p>
              </div>
              {/* <div className="bg-yellow-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-yellow-600">85%</h3>
                <p className="text-gray-600">Số lượt xem tin</p>
              </div> */}
              <div className="bg-orange-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-blue-600">
                  {result.totalAmount.toFixed(2)}
                </h3>
                <p className="text-gray-600">Số tiền đã chi</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-blue-600">
                  {vltn.totalJobPosts}
                </h3>
                <p className="text-gray-600">Việc làm đã đăng tháng này </p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-green-600">
                  {jobPostsmonth.find((item) => item.month === currentMonth1)
                    ?.slhoso || 0}
                </h3>
                <p className="text-gray-600">Ứng viên đã nộp tháng này</p>
              </div>
              {/* <div className="bg-yellow-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-yellow-600">85%</h3>
                <p className="text-gray-600">Số lượt xem tin tháng này</p>
              </div> */}
              <div className="bg-orange-100 rounded-lg p-4 text-center shadow-sm">
                <h3 className="text-xl font-bold text-blue-600">
                  {currentMonthTotal.toFixed(2)}
                </h3>
                <p className="text-gray-600">Số tiền đã chi tháng này</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Danh Sách Tin</h2>
              <table className="w-full mx-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-100 text-gray-700 border-b">
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Tin Tuyển Dụng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Số lượng hồ sơ
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ti.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {row.tieude}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {row.applications || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {row.trangthai || "-"}
                      </td>
                    </tr>
                  ))}
                  {ti.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Top Kỹ Năng Được Yêu Cầu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <BarChart width={400} height={300} data={topSkillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>
              <div className="space-y-4">
                {topSkillsData.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{skill.name}</span>
                    <div className="w-64 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 rounded-full h-4"
                        style={{ width: `${(skill.count / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === "analytics" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Phân Tích Theo Vị Trí
            </h2>
            <BarChart width={800} height={300} data={jobApplicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applied" fill="#8884d8" name="Số CV" />
              <Bar dataKey="interviewed" fill="#82ca9d" name="Phỏng Vấn" />
              <Bar dataKey="hired" fill="#ffc658" name="Tuyển Dụng" />
            </BarChart>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default EmployerDashboard;
// import React from "react";
// import { Box, Grid, Paper, Typography } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// // Dữ liệu mẫu
// const jobPostData = [
//   { month: "Tháng 1", postings: 12, applications: 50, interviews: 10 },
//   { month: "Tháng 2", postings: 15, applications: 80, interviews: 20 },
//   { month: "Tháng 3", postings: 8, applications: 40, interviews: 5 },
//   { month: "Tháng 4", postings: 18, applications: 100, interviews: 25 },
//   { month: "Tháng 5", postings: 20, applications: 120, interviews: 30 },
//   { month: "Tháng 6", postings: 10, applications: 60, interviews: 15 },
// ];

// const savedJobsData = [
//   { name: "Đã lưu", value: 400 },
//   { name: "Chưa lưu", value: 600 },
// ];

// const applicationSourcesData = [
//   { source: "Website", value: 300 },
//   { source: "LinkedIn", value: 150 },
//   { source: "Facebook", value: 100 },
//   { source: "Email", value: 50 },
// ];

// const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

// const RecruiterDashboard = () => {
//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Bảng Điều Khiển Nhà Tuyển Dụng
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Biểu đồ cột: Tin tuyển dụng và ứng tuyển */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Tin Tuyển Dụng và Ứng Tuyển
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={jobPostData}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="postings" fill="#8884d8" name="Tin tuyển dụng" />
//                 <Bar dataKey="applications" fill="#82ca9d" name="Ứng tuyển" />
//                 <Bar dataKey="interviews" fill="#FF8042" name="Phỏng vấn" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Biểu đồ đường: Xu hướng ứng tuyển */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Xu Hướng Ứng Tuyển
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={jobPostData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="applications"
//                   stroke="#8884d8"
//                   name="Ứng tuyển"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="interviews"
//                   stroke="#FF8042"
//                   name="Phỏng vấn"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Biểu đồ tròn: Công việc đã lưu */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Công Việc Đã Lưu
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={savedJobsData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label
//                 >
//                   {savedJobsData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Biểu đồ tròn: Nguồn ứng tuyển */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Nguồn Ứng Tuyển
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={applicationSourcesData}
//                   dataKey="value"
//                   nameKey="source"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label
//                 >
//                   {applicationSourcesData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Bảng tổng quan */}
//         <Grid item xs={12}>
//           <Paper sx={{ padding: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Thống Kê Tổng Quan
//             </Typography>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#f5f5f5" }}>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                     Tháng
//                   </th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                     Tin Tuyển Dụng
//                   </th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                     Ứng Tuyển
//                   </th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                     Phỏng Vấn
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {jobPostData.map((row, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       {row.month}
//                     </td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       {row.postings}
//                     </td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       {row.applications}
//                     </td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       {row.interviews}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RecruiterDashboard;
// import React from "react";
// import { Box, Paper, Typography } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// // Dữ liệu mẫu
// const rawData = [
//   {
//     id: 1,
//     MaNTT: 6,
//     loaiThanhtoan: null,
//     trangthai: "completed",
//     goimua: null,
//     sotien: "100.00",
//     Ngaythanhtoan: "2024-11-22T11:24:27.000Z",
//     Soluongmua: 5,
//     users: {
//       id: 6,
//       email: "admin@itjobs1.com",
//       username: "siteAdmin",
//     },
//   },
//   {
//     id: 2,
//     MaNTT: 7,
//     loaiThanhtoan: null,
//     trangthai: "pending",
//     goimua: null,
//     sotien: "200.00",
//     Ngaythanhtoan: null,
//     Soluongmua: 10,
//     users: {
//       id: 7,
//       email: "developer4@tech.com",
//       username: "DANH2034",
//     },
//   },
//   {
//     id: 3,
//     MaNTT: 31,
//     loaiThanhtoan: "other",
//     trangthai: "Thành công",
//     goimua: "goi1",
//     sotien: "10000.00",
//     Ngaythanhtoan: "2024-12-05T09:50:22.000Z",
//     Soluongmua: 1,
//     users: {
//       id: 31,
//       email: "nvphat@gmail.com",
//       username: "Nv phát",
//     },
//   },
// ];

// // Chuyển đổi dữ liệu để thống kê theo tháng
// const processData = (data) => {
//   const revenueByMonth = {};

//   data.forEach((transaction) => {
//     if (
//       transaction.trangthai === "completed" ||
//       transaction.trangthai === "Thành công"
//     ) {
//       const date = new Date(transaction.Ngaythanhtoan);
//       const month = `${date.getFullYear()}-${(date.getMonth() + 1)
//         .toString()
//         .padStart(2, "0")}`;

//       if (!revenueByMonth[month]) {
//         revenueByMonth[month] = {
//           month,
//           totalRevenue: 0,
//           totalTransactions: 0,
//         };
//       }

//       revenueByMonth[month].totalRevenue += parseFloat(transaction.sotien);
//       revenueByMonth[month].totalTransactions += 1;
//     }
//   });

//   return Object.values(revenueByMonth);
// };

// const revenueData = processData(rawData);

// const DoanhThuChart = () => {
//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Thống Kê Doanh Thu Theo Tháng
//       </Typography>
//       <Paper sx={{ padding: 2 }}>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart
//             data={revenueData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip formatter={(value) => `${value} VNĐ`} />
//             <Bar dataKey="totalRevenue" fill="#8884d8" name="Doanh Thu (VNĐ)" />
//             <Bar
//               dataKey="totalTransactions"
//               fill="#82ca9d"
//               name="Số Giao Dịch"
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </Paper>
//     </Box>
//   );
// };

// export default DoanhThuChart;
