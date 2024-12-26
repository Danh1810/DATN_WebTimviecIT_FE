import React, { useState, useEffect, useCallback } from "react";
import axios from "../../services/axios";
import Select from "react-select";
import { useDebounce } from "use-debounce";

const FILTERS = [
  {
    label: "Ngành nghề",
    key: "nganhNghe",
    options: ["CNTT", "Kế toán", "Marketing"],
  },
  {
    label: "Kinh nghiệm",
    key: "kinhNghiem",
    options: ["1 năm", "2-3 năm", "Trên 3 năm"],
  },
  {
    label: "Cấp bậc",
    key: "capBac",
    options: ["Nhân viên", "Trưởng nhóm", "Quản lý"],
  },
  {
    label: "Học vấn",
    key: "hocVan",
    options: ["Cao đẳng", "Đại học", "Thạc sĩ"],
  },
  {
    label: "Nơi làm việc",
    key: "noiLamViec",
    options: ["Hà Nội", "Đà Nẵng", "TP.HCM"],
  },
  {
    label: "Hình thức làm việc",
    key: "hinhThuc",
    options: ["Toàn thời gian", "Bán thời gian", "Freelance"],
  },
  {
    label: "Giới tính",
    key: "gioiTinh",
    options: ["Nam", "Nữ", "Khác"],
  },
  {
    label: "Tình trạng hôn nhân",
    key: "honNhan",
    options: ["Độc thân", "Đã kết hôn"],
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

const ProfileCard = React.memo(({ profile, onFavorite, onView }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold">{profile.hoVaTen}</h3>
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
            <span className="font-medium">Ngành nghề:</span> {profile.nganhNghe}
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, selectedCity, filters]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hoso");
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = profiles;

    // Apply search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (profile) =>
          profile.hoVaTen?.toLowerCase().includes(searchLower) ||
          profile.tenhoso?.toLowerCase().includes(searchLower) ||
          profile.kyNangLapTrinh?.toLowerCase().includes(searchLower)
      );
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(
        (profile) => profile.nguoitimviec?.thanhPho === selectedCity.value
      );
    }

    // Apply other filters
    filtered = filtered.filter((profile) => {
      return Object.entries(filters).every(([key, value]) => {
        return !value || profile[key]?.toString() === value;
      });
    });

    setFilteredProfiles(filtered);
  }, [profiles, debouncedSearchTerm, selectedCity, filters]);

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
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onFavorite={(id) => console.log(`Favorited profile: ${id}`)}
                onView={(id) => console.log(`Viewed profile: ${id}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
