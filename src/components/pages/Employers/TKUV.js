import { useState, useEffect, useCallback } from "react";
import axios from "../../services/axios";
import Select from "react-select";
import { useDebounce } from "use-debounce";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const FILTERS = [
  {
    label: "Kỹ năng lập trình",
    key: "kyNangLapTrinh",
    options: [
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "PHP",
      "Ruby",
      "Go",
      "Swift",
    ],
  },
  {
    label: "Cấp bậc hiện tại",
    key: "capBacHienTai",
    options: ["Fresher", "Junior", "Middle", "Senior", "Team Lead", "Manager"],
  },
  {
    label: "Kinh nghiệm làm việc",
    key: "kinhNghiemLamViec",
    options: [
      "Chưa có kinh nghiệm",
      "Dưới 1 năm",
      "1-2 năm",
      "2-3 năm",
      "3-5 năm",
      "Trên 5 năm",
    ],
  },
  {
    label: "Trình độ học vấn",
    key: "trinhDoHocVan",
    options: ["Trung cấp", "Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ"],
  },
  {
    label: "Mức lương mong muốn",
    key: "Mucluongmongmuon",
    options: [
      "Dưới 10 triệu",
      "10-15 triệu",
      "15-20 triệu",
      "20-30 triệu",
      "Trên 30 triệu",
    ],
  },
  {
    label: "Hình thức làm việc",
    key: "hinhThuclamviec",
    options: ["Toàn thời gian", "Bán thời gian", "Hợp đồng thời vụ"],
  },
];

const Filter = React.memo(({ filters, onFilterChange }) => (
  <div className="p-4 bg-gray-100 sticky top-0">
    <h2 className="mb-4 text-lg font-semibold">Bộ lọc nâng cao</h2>
    <div className="space-y-4">
      {FILTERS.map((filter) => (
        <div key={filter.key}>
          <label className="block mb-2 text-sm font-medium">
            {filter.label}
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            value={filters[filter.key] || ""}
          >
            <option value="">Tất cả</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  </div>
));

const SearchBar = ({
  cities,
  selectedCity,
  onCityChange,
  onInputChange,
  searchTerm,
  onSearchTermChange,
}) => (
  <div className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-white shadow">
    <div className="flex-grow">
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc kỹ năng..."
        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
    <div className="w-64">
      <Select
        options={cities}
        value={selectedCity}
        onChange={onCityChange}
        onInputChange={onInputChange}
        placeholder="Chọn tỉnh/thành phố"
        className="text-sm"
        isClearable
        isSearchable
      />
    </div>
  </div>
);
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Always show 5 pages if possible
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-4 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Trước
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded border ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Sau
      </button>
    </div>
  );
};

const ProfileCard = React.memo(({ profile, onFavorite, onView }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold">
          {profile.nguoitimviec.hoVaTen}
        </h3>
        <p className="text-gray-600">{profile.tenhoso}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Học vấn:</span>{" "}
            {profile.trinhDoHocVan}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Kinh nghiệm:</span>{" "}
            {profile.kinhNghiemLamViec}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Tên hồ sơ</span> {profile.tenhoso}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-sm text-gray-400">
          Cập nhật: {new Date(profile.ngayCapNhat).toLocaleDateString()}
        </p>
        <div className="mt-2 space-x-2">
          <button
            onClick={() => onFavorite(profile.id)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Lưu hồ sơ"
          >
            ❤️
          </button>
          <button
            onClick={() => onView(profile.id)}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            title="Xem hồ sơ"
          >
            👁
          </button>
        </div>
      </div>
    </div>
  </div>
));

function App() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginatedProfiles, setPaginatedProfiles] = useState([]);
  const [selectedhosoNTV, setSelectedhoNTV] = useState(null);
  const [error, setError] = useState(null);

  const [cities, setCities] = useState([
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "TP.HCM", label: "TP.HCM" },
  ]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const userid = localStorage.getItem("id");
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hoso");
      setProfiles(response.data);
      console.log("🚀 ~ fetchProfiles ~ response.data:", response.data);
      setFilteredProfiles(response.data.filter((job) => job.timkiem === true));
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };
  const xemChiTiet1 = (id) => {
    const post = featuredJobs.find((post) => post.id === id);
    setSelectedhoNTV(post); // Lưu bài đăng được chọn vào state
    console.log("🚀 ~ CVManagement ~ selectedhosoNTV:", selectedhosoNTV);
  };
  const featuredJobs = profiles.filter((job) => job.timkiem === true);
  const closeModal1 = () => {
    setSelectedhoNTV(null);
  };
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = featuredJobs;

    // Apply search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((profile) => {
        const matchesSearch = (value) => {
          if (!value) return false;
          if (typeof value === "string")
            return value.toLowerCase().includes(searchLower);
          if (Array.isArray(value))
            return value.some((item) => matchesSearch(item));
          if (typeof value === "object")
            return Object.values(value).some(matchesSearch);
          return String(value).toLowerCase().includes(searchLower);
        };

        // Search across the entire profile object
        return matchesSearch(profile) || matchesSearch(profile.nguoitimviec);
      });
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(
        (profile) =>
          profile.nguoitimviec?.thanhPho?.toLowerCase() ===
          selectedCity.value.toLowerCase()
      );
    }

    // Apply other filters
    filtered = filtered.filter((profile) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (key === "kyNangLapTrinh") {
          // Handle kyNangLapTrinh as JSON data
          const skills = Array.isArray(profile.kyNangLapTrinh)
            ? profile.kyNangLapTrinh
            : Object.values(profile.kyNangLapTrinh || {});
          return skills.some(
            (skill) => skill.toLowerCase() === value.toLowerCase()
          );
        }

        if (key === "Mucluongmongmuon") {
          // Handle salary range comparison
          const salary = Number(profile[key]);
          const range = value.toLowerCase();

          if (range === "dưới 10 triệu") return salary < 10000000;
          if (range === "10-15 triệu")
            return salary >= 10000000 && salary <= 15000000;
          if (range === "15-20 triệu")
            return salary >= 15000000 && salary <= 20000000;
          if (range === "20-30 triệu")
            return salary >= 20000000 && salary <= 30000000;
          if (range === "trên 30 triệu") return salary > 30000000;

          return true;
        }

        // Default string comparison for other fields
        const profileValue = profile[key];
        if (typeof profileValue === "string") {
          return profileValue.toLowerCase() === value.toLowerCase();
        }
        return profileValue?.toString() === value;
      });
    });

    setFilteredProfiles(filtered);
  }, [featuredJobs, debouncedSearchTerm, selectedCity, filters]);

  const handleCityChange = useCallback((option) => {
    setSelectedCity(option);
  }, []);

  const handleInputChange = useCallback(
    (inputValue) => {
      if (inputValue && !cities.some((city) => city.value === inputValue)) {
        setCities((prev) => [
          ...prev,
          { value: inputValue, label: inputValue },
        ]);
      }
    },
    [cities]
  );
  useEffect(() => {
    fetchProfiles();
  }, []); // Refetch when page changes

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    applyFilters();
  }, [debouncedSearchTerm, selectedCity, filters]);
  useEffect(() => {
    // Update paginated data when filtered data or page changes
    updatePaginatedData();
  }, [filteredProfiles, currentPage]);
  const updatePaginatedData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedProfiles(
      filteredProfiles.slice(indexOfFirstItem, indexOfLastItem)
    );
  };
  const handleSearch = async (id) => {
    // Dữ liệu cần gửi
    const dataToSend = {
      MaHS: id,
      Userid: userid,
    };

    console.log("🚀 ~ handleSearch ~ Data to send:", dataToSend);

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post("/luuhs", dataToSend, {
        headers: {
          "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
        },
      });

      // Kiểm tra trạng thái phản hồi
      if (response.status === 200 || response.status === 201) {
        console.log("Đã gọi handleSearch thành công");
        toast.success("Lưu hồ sơ thành công!"); // Thông báo thành công
        console.log("🚀 ~ handleSearch ~ response:", response.data);
      } else {
        // Nếu trạng thái không phải 200 hoặc 201
        const errorMessage = response.data?.message || "Lỗi không xác định";
        toast.error(`Không thể lưu hồ sơ: ${errorMessage}`);
      }
    } catch (error) {
      // Xử lý lỗi từ axios hoặc máy chủ
      console.error("🚀 ~ handleSearch ~ error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi không xác định";
      toast.error(`Lỗi khi lưu hồ sơ: ${errorMessage}`); // Thông báo lỗi
    }
  };

  const getTotalPages = () => Math.ceil(filteredProfiles.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-1/4 border-r">
        <Filter filters={filters} onFilterChange={handleFilterChange} />
      </aside>
      <main className="flex-1">
        <SearchBar
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          onInputChange={handleInputChange}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">
            Kết quả tìm thấy: {filteredProfiles.length} hồ sơ
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onFavorite={() => handleSearch(profile.id)}
                    onView={() => xemChiTiet1(profile.id)}
                  />
                ))}
              </div>

              {filteredProfiles.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={getTotalPages()}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
        {selectedhosoNTV && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gray-100 p-5 border-b flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedhosoNTV.tenhoso}
                </h2>
                <button
                  onClick={closeModal1}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content Container */}
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                    <img
                      src={selectedhosoNTV.nguoitimviec.anhDaiDien}
                      alt="Avatar"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedhosoNTV.nguoitimviec.hoVaTen || "N/A"}
                    </h3>
                    <p className="text-gray-600">
                      {selectedhosoNTV.capBacHienTai || "Chưa xác định"}
                    </p>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Thông Tin Cá Nhân
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Ngày Sinh:
                        </label>
                        <p className="text-gray-900">
                          {(() => {
                            const ngaySinh =
                              selectedhosoNTV.nguoitimviec.ngaySinh;

                            return ngaySinh
                              ? new Date(ngaySinh).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "N/A";
                          })()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Giới Tính:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.nguoitimviec.gioiTinh || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Địa chỉ:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.nguoitimviec.diaChi || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Thông Tin Liên Hệ
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Số điện thoại:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.nguoitimviec.soDienThoai || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Tỉnh/Thành phố:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.nguoitimviec.thanhPho || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Skills */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Kỹ Năng Nghề Nghiệp
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Kỹ năng lập trình:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.kyNangLapTrinh
                            ? Array.isArray(selectedhosoNTV.kyNangLapTrinh)
                              ? selectedhosoNTV.kyNangLapTrinh.join(", ")
                              : selectedhosoNTV.kyNangLapTrinh
                            : "Chưa nhập"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Chứng chỉ nghề nghiệp:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.chungChiNgheNghiep || "Chưa nhập"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Trình độ học vấn:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.trinhDoHocVan || "Chưa nhập"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Experience and Projects */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Kinh Nghiệm & Dự Án
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Kinh nghiệm làm việc:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.kinhNghiemLamViec || "Chưa nhập"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Dự án đã tham gia:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoNTV.duAnDaThamGia || "Chưa nhập"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Objective */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Mục Tiêu Nghề Nghiệp
                  </h4>
                  <p className="text-gray-900">
                    {selectedhosoNTV.mucTieuNgheNghiep || "Chưa nhập"}
                  </p>
                </div>

                {/* Online Profile */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Hồ sơ trực tuyến
                    </label>
                    <p className="text-gray-900">
                      {selectedhosoNTV.fileHoso ? "Có" : "Không"}
                    </p>
                  </div>
                  {selectedhosoNTV.fileHoso && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() =>
                        window.open(selectedhosoNTV.fileHoso, "_blank")
                      }
                    >
                      Xem hồ sơ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
