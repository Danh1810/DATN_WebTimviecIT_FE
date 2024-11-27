import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../services/axios";
const SearchBar = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  useEffect(() => {
    const fetchJobPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/jobposts/search`, {
          params: { keyword },
        });
        setJobPosts(response.data);
      } catch (error) {
        setError("Error fetching job posts.");
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchJobPosts();
    }
  }, [keyword]);

  const sampleJobs = [
    {
      id: 1,
      title: "Kế Toán Tổng Hợp",
      company: "Công Ty TNHH Một Thành Viên Dịch Vụ Bảo Vệ Sài Gòn Long Hải",
      salary: "Thỏa thuận",
      location: "Đồng Nai",
      timeLeft: "Còn 4 ngày",
      logo: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      title: "Lập Trình Viên Frontend",
      company: "Công Ty Cổ Phần Công Nghệ ABC",
      salary: "20-25 triệu",
      location: "Hồ Chí Minh",
      timeLeft: "Còn 2 ngày",
      logo: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      title: "Nhân Viên IT Hỗ Trợ",
      company: "Công Ty Dịch Vụ Hỗ Trợ XYZ",
      salary: "10-15 triệu",
      location: "Hà Nội",
      timeLeft: "Còn 1 tuần",
      logo: "https://via.placeholder.com/50",
    },
  ];

  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  // const handleSearch = (keyword) => {
  //   const filtered = sampleJobs.filter((job) =>
  //     job.title.toLowerCase().includes(keyword.toLowerCase())
  //   );
  //   setFilteredJobs(filtered);
  // };
  const [filters, setFilters] = useState({
    experience: "Tất cả kinh nghiệm",
    salary: "Tất cả mức lương",
    level: "Tất cả cấp bậc",
    degree: "Tất cả trình độ",
    type: "Loại công việc",
    gender: "Tất cả giới tính",
  });

  // Hàm xử lý khi thay đổi giá trị dropdown
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    // Lọc dữ liệu theo filters
    const filtered = sampleJobs.filter((job) => {
      return (
        (updatedFilters.experience === "Tất cả kinh nghiệm" ||
          job.experience === updatedFilters.experience) &&
        (updatedFilters.salary === "Tất cả mức lương" ||
          job.salary === updatedFilters.salary) &&
        (updatedFilters.level === "Tất cả cấp bậc" ||
          job.level === updatedFilters.level) &&
        (updatedFilters.degree === "Tất cả trình độ" ||
          job.degree === updatedFilters.degree) &&
        (updatedFilters.type === "Loại công việc" ||
          job.type === updatedFilters.type) &&
        (updatedFilters.gender === "Tất cả giới tính" ||
          job.gender === updatedFilters.gender)
      );
    });

    setFilteredJobs(filtered);
  };
  return (
    <div>
      <div className="bg-purple-700 p-4 rounded-lg shadow-md">
        {/* Container hai hàng */}
        <div className="flex flex-col gap-2 w-full">
          {/* Hàng 1: Thanh tìm kiếm chính */}
          <div className="flex items-center gap-2 h-16 bg-purple-700 w-full">
            {/* Ô nhập liệu */}
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="kế toán"
                className="w-full h-full p-3 pl-10 text-sm text-gray-800 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute top-3 left-3 text-gray-400">🔍</span>
            </div>
            {/* Dropdown nghề nghiệp */}
            <select className="h-full p-3 text-sm text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Lọc theo nghề nghiệp</option>
              <option>Kế toán</option>
              <option>Kỹ sư</option>
            </select>
            {/* Dropdown tỉnh thành */}
            <select className="h-full p-3 text-sm text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Lọc theo tỉnh thành</option>
              <option>Hà Nội</option>
              <option>Hồ Chí Minh</option>
            </select>
            {/* Nút tìm kiếm */}
            <button className="h-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              Tìm kiếm
            </button>
            {/* Nút lọc nâng cao */}
            <button className="h-full px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600">
              Lọc nâng cao
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 h-16 bg-white p-2 rounded-lg shadow-md w-full">
        {/* Dropdown các tùy chọn */}
        {[
          {
            key: "experience",
            label: "Tất cả kinh nghiệm",
            options: ["0-1 năm", "1-2 năm", "3-5 năm"],
          },
          {
            key: "salary",
            label: "Tất cả mức lương",
            options: ["Thỏa thuận", "10-15 triệu", "20-25 triệu"],
          },
          {
            key: "level",
            label: "Tất cả cấp bậc",
            options: ["Nhân viên", "Chuyên viên"],
          },
          {
            key: "degree",
            label: "Tất cả trình độ",
            options: ["Trung cấp", "Cao đẳng", "Đại học"],
          },
          {
            key: "type",
            label: "Loại công việc",
            options: ["Full-time", "Part-time"],
          },
          {
            key: "gender",
            label: "Tất cả giới tính",
            options: ["Nam", "Nữ", "Không yêu cầu"],
          },
        ].map((dropdown, index) => (
          <select
            key={index}
            className="flex-grow h-full p-2 text-sm border rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500"
            value={filters[dropdown.key]}
            onChange={(e) => handleFilterChange(dropdown.key, e.target.value)}
          >
            <option>{dropdown.label}</option>
            {dropdown.options.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
        ))}
        {/* Nút xoá chọn */}
        <button className="h-full text-sm text-blue-500 hover:underline">
          Xoá chọn
        </button>
        {/* Nút đóng */}
        <button className="h-full text-sm text-gray-500 hover:underline">
          Đóng
        </button>
      </div>
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div className="flex items-start justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg">
            {/* Nội dung bên trái */}
            <div className="flex items-start gap-4">
              {/* Logo hoặc tag */}
              <div className="flex-shrink-0">
                <img
                  src={job.logo}
                  alt="Company Logo"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              {/* Nội dung thông tin công việc */}
              <div>
                {/* Tiêu đề công việc */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h2>
                {/* Tên công ty */}
                <p className="text-sm text-gray-500">{job.company}</p>
                {/* Thông tin thêm */}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <p className="flex items-center gap-1">💲 {job.salary}</p>
                  <p className="flex items-center gap-1">📍 {job.location}</p>
                </div>
              </div>
            </div>

            {/* Nội dung bên phải */}
            <div className="flex flex-col items-end">
              {/* Icon yêu thích */}
              <button className="text-blue-500 hover:text-blue-700">❤️</button>
              {/* Thời gian còn lại */}
              <p className="mt-auto text-sm text-gray-400">⏳ {job.timeLeft}</p>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-gray-500 text-center">Không có kết quả phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
