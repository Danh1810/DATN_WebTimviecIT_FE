import React, { useState, useEffect, useMemo } from "react";
import axios from "../services/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobPosts, setJobPosts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [originalJobPosts, setOriginalJobPosts] = useState([]);
  const [originalCompanies, setOriginalCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [filters, setFilters] = useState({
    diaChiLamviec: "Tất cả địa điểm",
    loaiHopdong: "Tất cả loại hợp đồng",
    level: "Tất cả cấp bậc",
    skill: "Tất cả kỹ năng",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [jobsResponse, companiesResponse] = await Promise.all([
          axios.get(`/tintd/tk`, { params: { keyword } }),
          axios.get(`/nhatd/tkiem`, { params: { keyword } }),
        ]);

        setJobPosts(jobsResponse.data);
        setOriginalJobPosts(jobsResponse.data);
        console.log("🚀 ~ fetchData ~ jobsResponse.data:", jobsResponse.data);
        setCompanies(companiesResponse.data);
        setOriginalCompanies(companiesResponse.data);
        console.log(
          "🚀 ~ fetchData ~ companiesResponse.data:",
          companiesResponse.data
        );
      } catch (error) {
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchData();
    }
  }, [keyword]);

  const filteredJobPosts = useMemo(() => {
    return originalJobPosts.filter((job) => {
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

  // Pagination logic
  const currentItems =
    activeTab === "jobs"
      ? filteredJobPosts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : companies.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const totalPages = Math.ceil(
    (activeTab === "jobs" ? filteredJobPosts.length : companies.length) /
      itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setFilters({
      diaChiLamviec: "Tất cả địa điểm",
      loaiHopdong: "Tất cả loại hợp đồng",
      level: "Tất cả cấp bậc",
      skill: "Tất cả kỹ năng",
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-purple-700 p-4 rounded-lg shadow-md">
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

      {/* Tabs */}
      <div className="flex border-b mb-4 mt-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "jobs"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("jobs")}
        >
          Việc làm ({filteredJobPosts.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "companies"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("companies")}
        >
          Công ty ({companies.length})
        </button>
      </div>

      {activeTab === "jobs" && (
        <div className="flex items-center gap-2 h-16 bg-white p-2 rounded-lg shadow-md mb-4">
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
              ],
            },
            {
              key: "skill",
              label: "Tất cả kỹ năng",
              options: [
                "Java",
                "Python",
                "JavaScript",
                "React",
                "Angular",
                "Node.js",
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
      )}

      <div className="space-y-4">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : currentItems.length === 0 ? (
          <p className="text-gray-500">Không có kết quả phù hợp.</p>
        ) : (
          <>
            {activeTab === "jobs"
              ? // Jobs listing
                currentItems.map((job) => (
                  <Link key={job.id} to={`/tintuyendung/${job.id}`}>
                    <div className="flex items-start justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={job.employer.logo}
                            className="w-12 h-12 rounded-full"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {job.tieude}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {job.employer.ten}
                          </p>
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
                      <div className="flex flex-col items-end">
                        <button className="text-blue-500 hover:text-blue-700">
                          ❤️
                        </button>
                        <p className="mt-auto text-sm text-gray-400">
                          ⏳ {job.ngayHethan}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              : // Companies listing
                currentItems.map((company) => (
                  <Link key={company.id} to={`/ct/${company.id}`}>
                    <div className="flex items-start p-4 bg-white border rounded-lg shadow-md hover:shadow-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={company.logo}
                          alt={`${company.ten} Logo`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {company.ten}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          📍 {company.diachi}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          🏢 {company.linhvuc}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg disabled:opacity-50"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 border"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
