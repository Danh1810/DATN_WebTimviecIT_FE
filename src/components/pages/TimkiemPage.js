import React, { useState, useEffect, useMemo } from "react";
import axios from "../services/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [originalJobPosts, setOriginalJobPosts] = useState([]); // Danh sách gốc
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [filters, setFilters] = useState({
    diaChiLamviec: "Tất cả địa điểm",
    loaiHopdong: "Tất cả loại hợp đồng",
    level: "Tất cả cấp bậc",
    skill: "Tất cả kỹ năng",
  });

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchJobPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/tintd/tk`, {
          params: { keyword: keyword },
        });
        setJobPosts(response.data);
        setOriginalJobPosts(response.data); // Lưu danh sách gốc
      } catch (error) {
        setError("Lỗi khi tải danh sách công việc.");
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchJobPosts();
    }
  }, [keyword]);

  // Lọc dữ liệu dựa trên filters
  const filteredJobPosts = useMemo(() => {
    return originalJobPosts.filter((job) => {
      console.log("🚀 ~ returnoriginalJobPosts.filter ~ job:", job);
      const { diaChiLamviec, loaiHopdong, levels, skills } = job;

      const isMatch = [
        filters.diaChiLamviec === "Tất cả địa điểm" ||
          diaChiLamviec === filters.diaChiLamviec,
        filters.loaiHopdong === "Tất cả loại hợp đồng" ||
          loaiHopdong === filters.loaiHopdong,
        filters.level === "Tất cả cấp bậc" ||
          (Array.isArray(levels) &&
            levels.some(({ name }) => name === filters.level)),
        filters.skill === "Tất cả kỹ năng" ||
          (Array.isArray(skills) &&
            skills.some(({ ten }) => ten === filters.skill)),
      ];

      return isMatch.every(Boolean);
    });
  }, [filters, originalJobPosts]);

  const resetFilters = () => {
    setFilters({
      diaChiLamviec: "Tất cả địa điểm",
      loaiHopdong: "Tất cả loại hợp đồng",
      level: "Tất cả cấp bậc",
      skill: "Tất cả kỹ năng",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <div className="min h-screen">
      {/* Thanh tìm kiếm */}
      <div className="bg-purple-700 p-4 rounded-lg shadow-md ">
        <div className="flex items-center gap-2 h-16">
          <input
            type="text"
            placeholder="Nhập từ khóa..."
            className="flex-grow p-3 pl-10 text-sm border rounded-lg"
          />
          <button className="h-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex items-center gap-2 h-16 bg-white p-2 rounded-lg shadow-md">
        {[
          {
            key: "diaChiLamviec",
            label: "Tất cả địa điểm",
            options: ["Đà Nẵng", "Hà Nội", "Hồ Chí Minh"],
          },
          {
            key: "loaiHopdong",
            label: "Tất cả loại hợp đồng",
            options: ["Toàn thời gian", "Bán thời gian", "20-25 triệu"],
          },
          {
            key: "level",
            label: "Tất cả cấp bậc",
            options: [
              "Intern",
              "Junior",
              "Mid-level",
              "Senior",
              "Lead",
              "Manager",
              "Director",
              "VP",
              "C-level",
              "Owner",
            ],
          },
          {
            key: "skill",
            label: "Tất cả kỹ năng",
            options: [
              "Java",
              "Python",
              "JavaScript",
              "SQL",
              "C#",
              "C++",
              "PHP",
              "Ruby",
              "HTML",
              "CSS",
              "React",
              "Angular",
              "Node.js",
              "Machine Learning",
              "Data Analysis",
              "DevOps",
              "Cloud Computing",
              "Cybersecurity",
              "Networking",
              "Linux",
            ],
          },
        ].map((dropdown, index) => (
          <select
            key={index}
            value={filters[dropdown.key]}
            onChange={(e) => handleFilterChange(dropdown.key, e.target.value)}
            className="flex-grow p-2 border rounded-lg"
          >
            <option>{dropdown.label}</option>
            {dropdown.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
        <button
          onClick={resetFilters}
          className="text-sm text-blue-500 hover:underline"
        >
          Xóa chọn
        </button>
      </div>

      {/* Danh sách công việc */}
      <div className="space-y-4">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredJobPosts.length === 0 ? (
          <p className="text-gray-500">Không có kết quả phù hợp.</p>
        ) : (
          filteredJobPosts.map((job) => (
            <Link key={job.id} to={`/tintuyendung/${job.id}`}>
              <div className="flex items-start justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg">
                {/* Nội dung bên trái */}
                <div className="flex items-start gap-4">
                  {/* Logo hoặc tag */}
                  <div className="flex-shrink-0">
                    <img
                      src={job.employer.logo}
                      alt="Company Logo"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  {/* Nội dung thông tin công việc */}
                  <div>
                    {/* Tiêu đề công việc */}
                    <h2 className="text-lg font-semibold text-gray-800">
                      {job.tieude}
                    </h2>
                    {/* Tên công ty */}
                    <p className="text-sm text-gray-500">{job.employer.ten}</p>
                    {/* Thông tin thêm */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        💲 {job.mucluong}
                      </p>
                      <p className="flex items-center gap-1">
                        📍 {job.diaChiLamviec}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nội dung bên phải */}
                <div className="flex flex-col items-end">
                  {/* Icon yêu thích */}
                  <button className="text-blue-500 hover:text-blue-700">
                    ❤️
                  </button>
                  {/* Thời gian còn lại */}
                  <p className="mt-auto text-sm text-gray-400">
                    ⏳ {job.ngayHethan}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBar;
